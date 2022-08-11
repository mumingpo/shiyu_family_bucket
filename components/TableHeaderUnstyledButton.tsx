import * as React from 'react';
import {
  UnstyledButton,
  Group,
  Text,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';

import { ChevronsUp, ChevronsDown, ChevronRight } from 'tabler-icons-react';
import renderIf from '../utils/renderIf';

type ColumnName = 'key' | 'size' | 'lastModified';
type SortOption = null | ColumnName;
type SortDirection = 'asc' | 'desc';

type TableHeaderProps = {
  text: string,
  columnName: ColumnName,
  sortBy: SortOption,
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>,
  sortDirection: SortDirection,
  toggleSortDirection: ReturnType<typeof useToggle<SortDirection>>[1],
};

function TableHeaderUnstyledButton(props: TableHeaderProps): JSX.Element {
  const {
    text,
    columnName,
    sortBy,
    setSortBy,
    sortDirection,
    toggleSortDirection,
  } = props;

  return (
    <UnstyledButton
      sx={(theme) => ({
        width: '100%',
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        '&:hover': {
          backgroundColor: theme.colorScheme === 'light'
            ? theme.colors.gray[1]
            : theme.colors.dark[6],
        },
      })}
      onClick={() => {
        if (sortBy === columnName) {
          toggleSortDirection();
        } else {
          setSortBy(columnName);
          toggleSortDirection('asc');
        }
      }}
    >
      <Group position="apart">
        <Text>
          {text}
        </Text>
        {renderIf(sortDirection === 'asc' ? <ChevronsUp size={16}/> : <ChevronsDown size={16} />, sortBy === columnName)}
        {renderIf(<ChevronRight size={16}/>, sortBy !== columnName)}
      </Group>
    </UnstyledButton>
  );
}

export default TableHeaderUnstyledButton;
