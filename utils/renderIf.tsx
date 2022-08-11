import * as React from 'react';

function renderIf(toRender: JSX.Element, toIf: boolean) {
  if (toIf) {
    return toRender;
  }
  return true;
}

export default renderIf;
