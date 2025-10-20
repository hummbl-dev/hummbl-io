import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '..');
const srcDir = path.join(baseDir, 'src');

// Files to update with their old and new import paths
const fileUpdates = [
  {
    file: 'components/chat/ChatWidget.tsx',
    changes: [
      {
        from: "from '../../types/chat';",
        to: "from '../../../cascade/types/chat';",
      },
      {
        from: "from '../../types/chatContext';",
        to: "from '../../../cascade/types/chatContext';",
      },
    ],
  },
  {
    file: 'components/narratives/NarrativeCard.tsx',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
  {
    file: 'components/narratives/NarrativeList.tsx',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
  {
    file: 'components/view/ViewSwitcher.tsx',
    changes: [
      {
        from: "from '../../types/view';",
        to: "from '../../../cascade/types/view';",
      },
    ],
  },
  {
    file: 'components/chat/ConversationHistory.tsx',
    changes: [
      {
        from: "from '../../types/chat';",
        to: "from '../../../cascade/types/chat';",
      },
    ],
  },
  {
    file: 'components/chat/ChatWindow.tsx',
    changes: [
      {
        from: "from '../../types/chat';",
        to: "from '../../../cascade/types/chat';",
      },
    ],
  },
  {
    file: 'components/chat/ChatMessage.tsx',
    changes: [
      {
        from: "from '../../types/chat';",
        to: "from '../../../cascade/types/chat';",
      },
    ],
  },
  {
    file: 'components/Hero/Hero.tsx',
    changes: [
      {
        from: "from '../../types/view';",
        to: "from '../../../cascade/types/view';",
      },
    ],
  },
  {
    file: 'components/narratives/NarrativeDetailModal.tsx',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
  {
    file: 'components/narratives/NarrativeFilters.tsx',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
  {
    file: 'utils/__tests__/advancedSearch.test.ts',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
  {
    file: 'utils/__tests__/exportRoundTrip.test.ts',
    changes: [
      {
        from: "from '../../types/narrative';",
        to: "from '../../../cascade/types/narrative';",
      },
    ],
  },
];

// Process each file
fileUpdates.forEach(({ file, changes }) => {
  const filePath = path.join(srcDir, file);

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    changes.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(new RegExp(from, 'g'), to);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated imports in ${file}`);
    } else {
      console.log(`ℹ️  No changes needed for ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\nImport path update complete!');
