import * as React from 'react';
import { useViewportSize } from '@mantine/hooks';

function useHeightToBottomOfViewport(initialHeight = 500) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { height: viewportHeight } = useViewportSize();

  const [height, setHeight] = React.useState(initialHeight);

  React.useEffect(() => {
    const h = ref.current ? viewportHeight - ref.current.offsetTop : initialHeight;
    setHeight(h);
  }, [viewportHeight, initialHeight]);

  return { ref, height };
}

export default useHeightToBottomOfViewport;
