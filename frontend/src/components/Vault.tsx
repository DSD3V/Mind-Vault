import { useEffect, useState } from 'react';

import { ThoughtI, VaultEditRequestI, VaultI } from '../interfaces';
import {
  selectDidEditThoughts,
  selectDidEnterOrExitVault,
} from '../selectors/mindSelectors';
import { useAppSelector } from '../store';
import { Container, Div } from '../styles/GlobalStyles';
import { ThoughtsList } from './ThoughtsList';
import { VaultNavbar } from './VaultNavbar';
import { VaultsGrid } from './VaultsGrid';

export const Vault = ({ vault }: { vault: VaultI }) => {
  const [hasEditedThoughts, setHasEditedThoughts] = useState(false);
  const [hasReorderedVaults, setHasReorderedVaults] = useState(false);
  const [isEditingThoughts, setIsEditingThoughts] = useState(false);
  const [isEditingVaults, setIsEditingVaults] = useState(false);
  const [thoughtEditErrors, setThoughtEditErrors] = useState<Set<string>>(
    new Set()
  );
  const [vaultEditRequests, setVaultEditRequests] = useState<
    VaultEditRequestI[]
  >([]);
  const [vaultEditErrors, setVaultEditErrors] = useState<Set<string>>(
    new Set()
  );
  const [editedThoughts, setEditedThoughts] = useState(vault.thoughts);
  const [thoughtIdToNewHTML, setThoughtIdToNewHTML] = useState(
    vault.thoughts.reduce(
      (accum: { [key: string]: string }, thought: ThoughtI) => {
        accum[thought.thoughtId] = thought.html;
        return accum;
      },
      {}
    )
  );
  const [vaultNames, setVaultNames] = useState(
    vault.childVaults.reduce(
      (accum: { [key: string]: string }, vault: VaultI) => {
        accum[vault.vaultId] = vault.name;
        return accum;
      },
      {}
    )
  );
  const isRootVault = !vault.vaultId;
  const [currentTab, setCurrentTab] = useState(
    isRootVault ? 'vaults' : 'thoughts'
  );
  const didEditThoughts = useAppSelector(selectDidEditThoughts);
  const didEnterOrExitVault = useAppSelector(selectDidEnterOrExitVault);

  useEffect(
    () => setCurrentTab(isRootVault ? 'vaults' : 'thoughts'),
    [isRootVault]
  );

  useEffect(() => {
    if (didEnterOrExitVault) {
      setCurrentTab(isRootVault ? 'vaults' : 'thoughts');
      setEditedThoughts(vault.thoughts);
      setThoughtIdToNewHTML(
        vault.thoughts.reduce(
          (accum: { [key: string]: string }, thought: ThoughtI) => {
            accum[thought.thoughtId] = thought.html;
            return accum;
          },
          {}
        )
      );
    }
  }, [didEnterOrExitVault, isRootVault, vault.thoughts]);

  useEffect(() => {
    if (didEditThoughts) {
      setEditedThoughts(vault.thoughts);
      setThoughtIdToNewHTML(
        vault.thoughts.reduce(
          (accum: { [key: string]: string }, thought: ThoughtI) => {
            accum[thought.thoughtId] = thought.html;
            return accum;
          },
          {}
        )
      );
    }
  }, [didEditThoughts, vault.thoughts]);

  return (
    <>
      <VaultNavbar
        currentTab={currentTab}
        hasEditedThoughts={hasEditedThoughts}
        hasReorderedVaults={hasReorderedVaults}
        isEditingThoughts={isEditingThoughts}
        isEditingVaults={isEditingVaults}
        setCurrentTab={setCurrentTab}
        setHasEditedThoughts={setHasEditedThoughts}
        setHasReorderedVaults={setHasReorderedVaults}
        setIsEditingThoughts={setIsEditingThoughts}
        setIsEditingVaults={setIsEditingVaults}
        setThoughtIdToNewHTML={setThoughtIdToNewHTML}
        setVaultEditRequests={setVaultEditRequests}
        setVaultNames={setVaultNames}
        thoughtEditErrors={thoughtEditErrors}
        thoughtIdToNewHTML={thoughtIdToNewHTML}
        thoughts={editedThoughts}
        vaultEditErrors={vaultEditErrors}
        vaultEditRequests={vaultEditRequests}
        vaultName={vault.name}
        vaults={vault.childVaults}
      />
      <Container>
        {currentTab === 'thoughts' ? (
          <ThoughtsList
            hasEditedThoughts={hasEditedThoughts}
            isEditingThoughts={isEditingThoughts}
            setHasEditedThoughts={setHasEditedThoughts}
            setThoughtEditErrors={setThoughtEditErrors}
            setThoughtIdToNewHTML={setThoughtIdToNewHTML}
            setThoughts={setEditedThoughts}
            thoughtIdToNewHTML={thoughtIdToNewHTML}
            thoughts={editedThoughts}
            vaultId={vault.vaultId}
          />
        ) : !vault.childVaults.length && !isEditingVaults && isRootVault ? (
          <Div $f='1.2rem' $w='80%'>
            Click "Add / Edit / Delete Vaults" in the top right corner to create
            your first vault.
          </Div>
        ) : (
          <VaultsGrid
            isEditingVaults={isEditingVaults}
            parentVaultId={vault.vaultId}
            setHasReorderedVaults={setHasReorderedVaults}
            setVaultEditErrors={setVaultEditErrors}
            setVaultEditRequests={setVaultEditRequests}
            setVaultNames={setVaultNames}
            vaultNames={vaultNames}
            vaults={vault.childVaults}
          />
        )}
      </Container>
    </>
  );
};
