
#!/usr/bin/env bash
set -euo pipefail

HOST=""
PACKAGE_ID="com.quizhero.app"
APP_NAME="QuizHero Ultimate Pro"
KEY_ALIAS="quizhero"
KEYSTORE="quizhero.jks"

print_usage() {
  echo "Usage: $0 --host <https://your-host.web.app>"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; print_usage; exit 1 ;;
  esac
done

if [[ -z "$HOST" ]]; then
  echo "Error: --host is required."
  print_usage
  exit 1
fi

echo "1) Building web app..."
npm run build

read -p "Do you want to deploy to Firebase Hosting now? (y/n) " DEPLOY_ANS
if [[ "$DEPLOY_ANS" == "y" ]]; then
  firebase deploy --only hosting
fi

MANIFEST_URL="${HOST}/manifest.webmanifest"
echo "Checking manifest at: $MANIFEST_URL"
if ! curl --fail -sS "$MANIFEST_URL" > /dev/null; then
  echo "ERROR: Could not fetch manifest at $MANIFEST_URL"
  exit 1
fi
echo "Manifest reachable."

echo "Setting up Bubblewrap build..."
TWA_DIR="twa-build"
rm -rf "$TWA_DIR"
mkdir -p "$TWA_DIR"
pushd "$TWA_DIR" > /dev/null

npx @bubblewrap/cli init --manifest="$MANIFEST_URL" --packageId="$PACKAGE_ID" --applicationName="$APP_NAME" --startUrl="/"

if [[ ! -f "../$KEYSTORE" ]]; then
  echo "Creating keystore ($KEYSTORE)..."
  keytool -genkeypair -v -keystore "../$KEYSTORE" -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 -validity 10000
fi

echo "Building signed APK..."
npx @bubblewrap/cli build --keystore="../$KEYSTORE" --keystoreAlias="$KEY_ALIAS"

APK_PATH=$(find android-project -type f -path "*/outputs/apk/release/*release*.apk" | head -n1 || true)
if [[ -z "$APK_PATH" ]]; then
  echo "APK not found. Check twa-build/android-project/app/build/outputs/apk/release"
  popd > /dev/null
  exit 1
fi

OUT_APK="../QuizHero_Ultimate_Pro-release.apk"
cp "$APK_PATH" "$OUT_APK"
popd > /dev/null

echo "✅ APK built: $OUT_APK"
echo "You can copy it to your Android phone and install it manually (enable Unknown Sources)."
