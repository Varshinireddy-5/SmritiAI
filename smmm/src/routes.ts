import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { Vault } from './pages/Vault';
import { Memories } from './pages/Memories';
import { Health } from './pages/Health';
import { Money } from './pages/Money';
import { People } from './pages/People';
import { Legal } from './pages/Legal';
import { LifeRecords } from './pages/LifeRecords';
import { Legacy } from './pages/Legacy';
import { SOS } from './pages/SOS';
import { Backup } from './pages/Backup';
import { Settings } from './pages/Settings';
import { AIInsights } from './pages/AIInsights';
import { Timeline } from './pages/Timeline';
import { SecurityCenter } from './pages/SecurityCenter';
import Avatar3DDemo from './pages/Avatar3DDemo';
import VoiceDemo from './pages/VoiceDemo';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'vault', Component: Vault },
      { path: 'memories', Component: Memories },
      { path: 'timeline', Component: Timeline },
      { path: 'health', Component: Health },
      { path: 'money', Component: Money },
      { path: 'people', Component: People },
      { path: 'legal', Component: Legacy },
      { path: 'legacy', Component: Legacy },
      { path: 'ai-insights', Component: AIInsights },
      { path: 'sos', Component: SOS },
      { path: 'settings', Component: Settings },
      { path: 'security', Component: SecurityCenter },
      { path: 'avatar-3d', Component: Avatar3DDemo },
      { path: 'voice-demo', Component: VoiceDemo },
      // Compatibility paths
      { path: 'after-me', Component: Legacy },
      { path: 'emergency', Component: SOS },
      { path: 'life-records', Component: LifeRecords },
      { path: 'backup', Component: Backup },
    ],
  },
]);