import { Redirect, type Href } from 'expo-router';

const loginRoute = '/(auth)/login' as Href;

export default function IndexScreen() {
  return <Redirect href={loginRoute} />;
}
