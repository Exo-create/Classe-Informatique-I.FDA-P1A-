name: Get Done Column ID

on:
  workflow_dispatch:

jobs:
  get_column_id:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install @octokit/rest

      - name: Create get_column_id.mjs
        run: |
          echo "import { Octokit } from '@octokit/rest';

          const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

          async function getColumnId() {
            const columns = await octokit.projects.listColumns({
              project_id: process.env.GITHUB_PROJECT_ID
            });

            const doneColumn = columns.data.find(column => column.name === 'Terminé');
            if (doneColumn) {
              console.log('ID de la colonne \"Terminé\" :', doneColumn.id);
            } else {
              console.log('Colonne \"Terminé\" non trouvée.');
            }
          }

          getColumnId();" > get_column_id.mjs

      - name: Run get_column_id.mjs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_PROJECT_ID: ${{ secrets.GITHUB_PROJECT_ID }}
        run: node get_column_id.mjs
