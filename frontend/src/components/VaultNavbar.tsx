import { SetStateAction } from 'react';

import {
  CLEAR_ADD_THOUGHT_MESSAGES,
  CLEAR_DELETE_THOUGHT_MESSAGES,
  CLEAR_EDIT_THOUGHTS_MESSAGES,
  editThoughts,
} from '../actions/thoughtActions';
import {
  CLEAR_ADD_VAULT_MESSAGES,
  CLEAR_DELETE_VAULT_MESSAGES,
  CLEAR_EDIT_VAULTS_MESSAGES,
  editVaults,
  EXIT_VAULT,
  reorderVaults,
} from '../actions/vaultActions';
import { ThoughtI, VaultEditRequestI, VaultI } from '../interfaces';
import { selectParentVaultNames } from '../selectors/mindSelectors';
import { selectIsEditingThoughts } from '../selectors/thoughtSelectors';
import { selectIsEditingVaults } from '../selectors/vaultSelectors';
import { useAppDispatch, useAppSelector } from '../store';
import { Button, Div } from '../styles/GlobalStyles';
import {
  VaultNav,
  VaultNavDivider,
  VaultNavLink,
  VaultNavTitle,
  VaultNavTitleDiv,
} from '../styles/VaultStyles';

const NAV_BUTTON_WIDTH = '210px';

export const VaultNavbar = ({
  currentTab,
  hasEditedThoughts,
  hasReorderedVaults,
  isEditingThoughts,
  isEditingVaults,
  setCurrentTab,
  setHasEditedThoughts,
  setHasReorderedVaults,
  setIsEditingThoughts,
  setIsEditingVaults,
  setThoughtIdToNewHTML,
  setVaultEditRequests,
  setVaultNames,
  thoughtEditErrors,
  thoughtIdToNewHTML,
  thoughts,
  vaultEditErrors,
  vaultEditRequests,
  vaultName,
  vaults,
}: {
  currentTab: string;
  hasEditedThoughts: boolean;
  hasReorderedVaults: boolean;
  isEditingThoughts: boolean;
  isEditingVaults: boolean;
  setCurrentTab: React.Dispatch<SetStateAction<string>>;
  setHasEditedThoughts: React.Dispatch<SetStateAction<boolean>>;
  setHasReorderedVaults: React.Dispatch<SetStateAction<boolean>>;
  setIsEditingThoughts: (
    callback: (isEditingThoughts: boolean) => boolean
  ) => void;
  setIsEditingVaults: (callback: (isEditingVaults: boolean) => boolean) => void;
  setThoughtIdToNewHTML: React.Dispatch<
    SetStateAction<{ [key: string]: string }>
  >;
  setVaultEditRequests: React.Dispatch<SetStateAction<VaultEditRequestI[]>>;
  setVaultNames: React.Dispatch<SetStateAction<{ [key: string]: string }>>;
  thoughtEditErrors: Set<string>;
  thoughtIdToNewHTML: { [key: string]: string };
  thoughts: ThoughtI[];
  vaultEditErrors: Set<string>;
  vaultEditRequests: VaultEditRequestI[];
  vaultName: string;
  vaults: VaultI[];
}) => {
  const dispatch = useAppDispatch();
  const isSavingThoughtChanges = useAppSelector(selectIsEditingThoughts);
  const isSavingVaultChanges = useAppSelector(selectIsEditingVaults);
  const parentVaultNames = useAppSelector(selectParentVaultNames);

  const hasThoughtErrors = !!thoughtEditErrors.size;
  const hasVaultErrors = !!vaultEditErrors.size;
  const isRootVault = !parentVaultNames.length;

  const truncatedParentVaultName =
    (parentVaultNames[parentVaultNames.length - 1] || '').length > 16
      ? parentVaultNames[parentVaultNames.length - 1].slice(0, 16) + '...'
      : parentVaultNames[parentVaultNames.length - 1];

  const parentVaultNamesString = parentVaultNames
    .map((vaultName: string) =>
      vaultName.length <= 20 ? vaultName : vaultName.slice(0, 20) + '...'
    )
    .join(' / ')
    .slice(2);

  const toggleEditingThoughts = () => {
    if (!hasThoughtErrors) {
      if (isEditingThoughts) {
        if (!!thoughts.length && hasEditedThoughts) {
          const newThoughts = thoughts.map(thought => ({
            ...thought,
            html: thoughtIdToNewHTML[thought.thoughtId],
          }));
          dispatch(
            editThoughts({
              thoughts: newThoughts,
            })
          );
          setHasEditedThoughts(false);
        }
        dispatch(CLEAR_ADD_THOUGHT_MESSAGES());
        dispatch(CLEAR_DELETE_THOUGHT_MESSAGES());
      } else {
        dispatch(CLEAR_EDIT_THOUGHTS_MESSAGES());
      }
      setIsEditingThoughts(prevState => !prevState);
    }
  };

  const toggleEditingVaults = () => {
    if (!hasVaultErrors) {
      if (isEditingVaults) {
        if (!!vaultEditRequests.length) {
          dispatch(
            editVaults({
              vaultEditRequests,
            })
          );
          setVaultEditRequests([]);
        }
        if (hasReorderedVaults) {
          dispatch(reorderVaults({ vaults }));
          setHasReorderedVaults(false);
        }
        dispatch(CLEAR_ADD_VAULT_MESSAGES());
        dispatch(CLEAR_DELETE_VAULT_MESSAGES());
      } else {
        dispatch(CLEAR_EDIT_VAULTS_MESSAGES());
        setVaultNames(
          vaults.reduce((accum: { [key: string]: string }, vault: VaultI) => {
            accum[vault.vaultId] = vault.name;
            return accum;
          }, {})
        );
      }
      setIsEditingVaults(prevState => !prevState);
    }
  };

  return (
    <VaultNav>
      <Div $d='column' $j='space-between'>
        <Div $a='start' $j='space-between' $m='12px 0 0 0'>
          {!isEditingThoughts && !isEditingVaults && !isRootVault ? (
            <Button
              $w={NAV_BUTTON_WIDTH}
              onClick={() => dispatch(EXIT_VAULT())}
            >
              Return to{' '}
              {parentVaultNames.length > 1
                ? truncatedParentVaultName
                : 'Root Vaults'}
            </Button>
          ) : (
            <Button $isHidden={true} $w={NAV_BUTTON_WIDTH} />
          )}
          {currentTab === 'thoughts' ? (
            <Button
              $isDisabled={hasThoughtErrors || isSavingThoughtChanges}
              $w={NAV_BUTTON_WIDTH}
              onClick={toggleEditingThoughts}
            >
              {isEditingThoughts
                ? 'Done Adding / Editing / Deleting Thoughts'
                : 'Add / Edit / Delete Thoughts'}
            </Button>
          ) : (
            <Button
              $isDisabled={hasVaultErrors || isSavingVaultChanges}
              $w={NAV_BUTTON_WIDTH}
              onClick={toggleEditingVaults}
            >
              {isEditingVaults
                ? isSavingVaultChanges
                  ? 'Saving Changes...'
                  : 'Done Adding / Editing / Deleting Vaults'
                : 'Add / Edit / Delete Vaults'}
            </Button>
          )}
        </Div>
        <VaultNavTitleDiv>
          {!isRootVault && (
            <>
              {!!parentVaultNames.length && (
                <Div $f='1rem' $m='0 0 1px 0'>
                  {parentVaultNamesString +
                    (!!parentVaultNamesString.length ? ' / ' : '')}
                </Div>
              )}
              <VaultNavTitle>{vaultName}</VaultNavTitle>
            </>
          )}
        </VaultNavTitleDiv>
        {!isRootVault && (
          <Div $m='8px 0 8px 0'>
            <VaultNavLink
              $isSelected={currentTab === 'thoughts'}
              onClick={() => setCurrentTab('thoughts')}
            >
              Thoughts
            </VaultNavLink>
            <VaultNavDivider>|</VaultNavDivider>
            <VaultNavLink
              $isSelected={currentTab === 'vaults'}
              onClick={() => setCurrentTab('vaults')}
            >
              Vaults
            </VaultNavLink>
          </Div>
        )}
      </Div>
    </VaultNav>
  );
};
