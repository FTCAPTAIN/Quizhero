# PocketBase Setup (Quick)

1) Download PocketBase from https://pocketbase.io/docs/ and run:
   ./pocketbase serve
   Admin UI: http://127.0.0.1:8090

2) Import collections:
   - Admin UI → Settings → Import collections → upload `import.json`

3) Frontend usage:
```
import PocketBase from 'pocketbase'
const pb = new PocketBase('http://127.0.0.1:8090')
const list = await pb.collection('questions').getFullList({ filter: `quiz = "<QUIZ_ID>"`})
```
