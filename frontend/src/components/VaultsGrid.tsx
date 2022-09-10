import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { enterVault, REORDER_VAULTS_IN_STATE } from '../actions/vaultActions';
import { EditVaultForm } from './EditVaultForm';
import { VaultEditRequestI, VaultI } from '../interfaces';
import { NewVaultForm } from './NewVaultForm';
import { useAppDispatch } from '../store';
import { EmptyVaultImage, VaultCell, VaultImage, VaultsGridContainer, VaultTitle } from '../styles/VaultStyles';
import { VaultsGridAlert } from './VaultsGridAlert';

export const VaultsGrid = ({
  isEditingVaults: isEditing,
  parentVaultId,
  setHasReorderedVaults,
  setVaultEditErrors,
  setVaultEditRequests,
  setVaultNames,
  vaultNames,
  vaults,
}: {
  isEditingVaults: boolean;
  parentVaultId: string;
  setHasReorderedVaults: Dispatch<SetStateAction<boolean>>;
  setVaultEditErrors: Dispatch<SetStateAction<Set<string>>>;
  setVaultEditRequests: Dispatch<SetStateAction<VaultEditRequestI[]>>;
  setVaultNames: Dispatch<SetStateAction<{ [key: string]: string }>>;
  vaultNames: { [key: string]: string };
  vaults: VaultI[];
}) => {
  const dispatch = useAppDispatch();
  const [sortableItems, setSortableItems] = useState(vaults.map((vault) => vault.vaultId));
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor),
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    setSortableItems(vaults.map((vault) => vault.vaultId));
  }, [vaults]);

  const handleDragEnd = (evt: any) => {
    setActiveId(null);
    const { active, over } = evt;
    if (active.id !== over.id) {
      const newIndex = sortableItems.indexOf(over.id);
      const oldIndex = sortableItems.indexOf(active.id);
      dispatch(REORDER_VAULTS_IN_STATE({ newIndex, oldIndex }));
      setHasReorderedVaults(true);
    }
  };

  const handleDragStart = (evt: any) => {
    const { active } = evt;
    setActiveId(active.id);
  };

  return (
    <VaultsGridContainer>
      <VaultsGridAlert />
      {isEditing ? (
        <>
          <NewVaultForm parentVaultId={parentVaultId} setVaultNames={setVaultNames} vaultNames={vaultNames} />
          <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
            <SortableContext items={sortableItems}>
              {vaults.map((vault) => (
                <EditVaultForm
                  handle={true}
                  isActive={activeId === vault.vaultId}
                  key={vault.vaultId}
                  setEditErrors={setVaultEditErrors}
                  setVaultEditRequests={setVaultEditRequests}
                  setVaultNames={setVaultNames}
                  vault={vault}
                  vaultNames={vaultNames}
                />
              ))}
              <DragOverlay>
                {!!activeId ? (
                  <EditVaultForm
                    handle={true}
                    id={activeId}
                    setEditErrors={setVaultEditErrors}
                    setVaultEditRequests={setVaultEditRequests}
                    setVaultNames={setVaultNames}
                    vault={vaults.find((vault) => vault.vaultId === activeId)!}
                    vaultNames={vaultNames}
                  />
                ) : null}
              </DragOverlay>
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <>
          {vaults.map((vault: VaultI) => (
            <VaultCell key={vault.vaultId} onClick={() => dispatch(enterVault({ vaultToEnter: vault }))}>
              <VaultTitle>{vault.name}</VaultTitle>
              {!!vault.imageUrl ? <VaultImage src={vault.imageUrl} /> : <EmptyVaultImage />}
            </VaultCell>
          ))}
        </>
      )}
    </VaultsGridContainer>
  );
};
