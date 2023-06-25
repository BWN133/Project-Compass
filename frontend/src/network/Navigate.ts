import { Link, useNavigate } from 'react-router-dom';
// useNavigation.ts

export function useNavigation() {
  const navigate = useNavigate();

  function navigateBF(steps: number) {
    navigate(steps);
  }
  function navigateURL(url: String)
  {
    navigate(url as never, {} as never);
  }
  
  return { navigate };
}
