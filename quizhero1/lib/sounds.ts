
export function playSound(name: string) {
  try {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play().catch(()=>{});
  } catch(e) {}
}
