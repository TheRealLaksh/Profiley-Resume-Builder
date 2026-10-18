import React, { lazy, useMemo } from 'react';
import ViewSwitch from './ViewSwitch';
import { classicResume } from './classic';
import './switch.css';

const App = lazy(() => import('../App.jsx'));

/** /laksh by default: the normal Profiley read-only resume, plus the switch to the creative page. */
export default function LakshClassic() {
  const preset = useMemo(() => classicResume(), []);
  return <App preset={preset} viewSwitch={<ViewSwitch creative={false} />} />;
}
