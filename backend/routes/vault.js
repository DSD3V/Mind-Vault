import { Router } from 'express';
import stringifyObject from 'stringify-object';

import { Vault } from '../schemas/Vault.js';
import { session } from '../server.js';

const router = Router();

router.delete('/deleteVault', async (req, res) => {
  const { vaultId } = req.body;

  try {
    await session.run(
      `MATCH (vault: Vault)-[*0..]->(nodes)
       WHERE vault.vaultId = '${vaultId}'
       DETACH DELETE nodes`
    );
    res.status(200).json({ message: 'Vault successfully deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete vault.', error });
  }
});

router.patch('/editVaults', async (req, res) => {
  const { vaultEditRequests } = req.body;

  try {
    await session.run(
      `UNWIND ${stringifyObject(vaultEditRequests)} as vaultEditRequest
       MATCH (vault: Vault)
       WHERE vault.vaultId = vaultEditRequest.vaultId
       SET vault.imageUrl = vaultEditRequest.newImage, vault.name = vaultEditRequest.newName`
    );
    res.status(200).json({ message: 'Vaults successfully edited.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to edit vaults.', error });
  }
});

router.patch('/reorderVaults', async (req, res) => {
  const { vaults } = req.body;
  const vaultsWithIndex = vaults.map((vault, index) => ({
    ...vault,
    index: `${vaults.length - index - 1}`,
  }));

  try {
    await session.run(
      `UNWIND ${stringifyObject(vaultsWithIndex)} as vaultWithIndex
       MATCH (vault: Vault)
       WHERE vault.vaultId = vaultWithIndex.vaultId
       SET vault.orderIndex = vaultWithIndex.index`
    );
    res.status(200).json({ message: 'Vaults successfully reordered.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to reorder vaults.', error });
  }
});

router.post('/addVault', async (req, res) => {
  const { imageUrl, name, orderIndex, parentVaultId, userId } = req.query;
  const newVaultId = userId + '-' + Date.now();
  const escapedName = name.replace(/'/g, '&apos;');

  try {
    await session.run(
      parentVaultId
        ? `MATCH (vault: Vault)
           WHERE vault.vaultId = '${parentVaultId}'
           CREATE (newVault: Vault {imageUrl: '${imageUrl}', name: '${escapedName}', orderIndex: '${orderIndex}',
                   userId: '${userId}', vaultId: '${newVaultId}'})<-[:IS_PARENT_VAULT_OF]-(vault)`
        : `CREATE (vault: Vault {imageUrl: '${imageUrl}', name: '${escapedName}', orderIndex: '${orderIndex}',
                   userId: '${userId}', vaultId: '${newVaultId}'})<-[:IS_PARENT_VAULT_OF]-(vault)`
    );
    const newVault = new Vault({
      childVaults: [],
      imageUrl,
      name,
      thoughts: [],
      vaultId: newVaultId,
    });
    res.status(200).json({ message: 'Vault successfully added.', newVault });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add vault.', error });
  }
});

export default router;
