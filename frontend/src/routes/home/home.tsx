import { getHomeWelcomeMessage } from './home.utils';

export function Home() {
  return <main>{getHomeWelcomeMessage()}</main>;
}
