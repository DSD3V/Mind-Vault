import { Router } from 'express';

import { session } from '../server.js';

const router = Router();

router.get('/getMind', async (req, res) => {
  const { userId } = req.query;

  try {
    const queryResult = await session.run(
      `MATCH (vault: Vault)-[:IS_PARENT_VAULT_OF]->(childVault: Vault)
      WHERE vault.userId = '${userId}'
      RETURN vault, childVault AS link
      ORDER BY vault.orderIndex DESC, childVault.orderIndex DESC
      UNION
      MATCH (vault: Vault)-[:CONTAINS_THOUGHT]->(thought: Thought)
      WHERE vault.userId = '${userId}'
      RETURN vault, thought AS link
      ORDER BY vault.orderIndex DESC, thought.orderIndex DESC`
    );

    const vaultIdToChildVaultIds = {};
    const vaultIdToVault = {};
    let mind = [];

    queryResult.records.forEach(record => {
      const parentVault = {
        ...record._fields[0].properties,
        childVaults: [],
        thoughts: [],
      };
      const parentVaultId = parentVault.vaultId;

      if (record._fields[1].labels[0] === 'Vault') {
        const childVault = {
          ...record._fields[1].properties,
          childVaults: [],
          thoughts: [],
        };
        const childVaultId = childVault.vaultId;

        if (childVaultId === parentVaultId) {
          mind.push(childVault);
        } else {
          if (parentVaultId in vaultIdToChildVaultIds) {
            vaultIdToChildVaultIds[parentVaultId].push(childVaultId);
          } else {
            vaultIdToChildVaultIds[parentVaultId] = [childVaultId];
          }
        }
        vaultIdToVault[parentVaultId] = parentVault;
        vaultIdToVault[childVaultId] = childVault;
      } else {
        vaultIdToVault[parentVaultId].thoughts.push(
          record._fields[1].properties
        );
      }
    });

    for (let i = 0; i < mind.length; i++) {
      mind[i].childVaults = getChildVaultsHelper({
        childVaults: [],
        vaultId: mind[i].vaultId,
        vaultIdToChildVaultIds,
        vaultIdToVault,
      });
    }
    res.status(200).json({ message: 'Successfully retrieved mind.', mind });
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve mind.', error });
  }
});

const getChildVaultsHelper = ({
  childVaults,
  vaultId,
  vaultIdToChildVaultIds,
  vaultIdToVault,
}) => {
  (vaultIdToChildVaultIds[vaultId] || []).forEach(childVaultId => {
    childVaults.push(vaultIdToVault[childVaultId]);
    childVaults[childVaults.length - 1].childVaults = getChildVaultsHelper({
      childVaults: [],
      vaultId: childVaultId,
      vaultIdToChildVaultIds,
      vaultIdToVault,
    });
  });
  return childVaults;
};

export default router;
