const express = require("express");
const router = express.Router();
//blockchain 


'use strict';


const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function cllBc() {
	
	try {
			const ccp = buildCCPOrg1();

		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
	const wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);

		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
			const network = await gateway.getNetwork(channelName);

		const contract = network.getContract(chaincodeName);

	     
		console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
			let result = await contract.evaluateTransaction('GetAllAssets');
			// console.log(`${prettyJSONString(result)}`)
			return {
				 data: `${(result)}`
			};
			console.log('......................22222222222222222222222222222222222222222')
     



		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
}

async function CreateNewAssetBC(reqAsset) {
  try {
    console.log(reqAsset)
      const ccp = buildCCPOrg1();

      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
      const wallet = await buildWallet(Wallets, walletPath);

      await enrollAdmin(caClient, wallet, mspOrg1);

      await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

      const gateway = new Gateway();

      try {
          await gateway.connect(ccp, {
              wallet,
              identity: org1UserId,
              discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
          });
          const network = await gateway.getNetwork(channelName);

          const contract = network.getContract(chaincodeName);

          console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, game name, owner, owner type, and game value arguments');
          result = await contract.submitTransaction('CreateAsset', reqAsset.ID, reqAsset.GameName, reqAsset.Owner, reqAsset.OwnerType, reqAsset.GameValue);
          console.log('*** Result: committed');
          if (`${result}` !== '') {
              console.log(result)
              return {
                  data: `${(result)}`
              };
          }

      } finally {
          gateway.disconnect();
      }
  } catch (error) {
      console.error(`******** FAILED to run the application: ${error}`);
      process.exit(1);
  }
}

async function GetAssetDetails(AssetID){
  try {
    const ccp = buildCCPOrg1();

  const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
const wallet = await buildWallet(Wallets, walletPath);

  await enrollAdmin(caClient, wallet, mspOrg1);

  await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

  const gateway = new Gateway();

  try {
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
    });
    const network = await gateway.getNetwork(channelName);

  const contract = network.getContract(chaincodeName);


  console.log('\n--> Evaluate Transaction: ReadAsset, function returns ' + AssetID+ '  attributes');
  result = await contract.evaluateTransaction('ReadAsset', AssetID);
  
  return {
    data: `${(result)}`
 };







  } finally {
    gateway.disconnect();
  }
} catch (error) {
  console.error(`******** FAILED to run the application: ${error}`);
  process.exit(1);
}


}



async function DeleteAssetBC(AssetID){
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
      });
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      console.log('\n--> Submit Transaction: DeleteAsset, deletes an asset with given id');
      const result = await contract.submitTransaction('DeleteAsset', AssetID);
      console.log('*** Result: committed');
      if (`${result}` !== '') {
        return {
          data: `${result}`
        };
      }
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}
async function UpdateAssetBC(id, updatedData) {
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
      });
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      try {
        console.log('\n--> Submit Transaction: UpdateAsset, UpdateAsset asset with ID, game name, owner, owner type, and game value arguments');
        result = await contract.submitTransaction('UpdateAsset', id, updatedData.GameName, updatedData.Owner, updatedData.OwnerType, updatedData.GameValue);
        console.log('******** FAILED to return an error');
      } catch (error) {
        console.log(`*** Successfully caught the error: \n    ${error}`);
      }

      if (`${result}` !== '') {
        return {
          data: `${(result)}`
        };
      }
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}

async function TransferAssetBC(id, newOwner) {
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);
    await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
      });
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      console.log('\n--> Submit Transaction: TransferAsset, transfers an asset with given id to a new owner');
      const result = await contract.submitTransaction('TransferAsset', id, newOwner);
      console.log('*** Result: committed');
      if (`${result}` !== '') {
        return {
          data: `${result}`
        };
      }
    } finally {
      gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}
 

// CREATE Asset
router.route("/create-asset").post(async (req, res, next) => {
  try {
    console.log(req.body)
    await CreateNewAssetBC(req.body)
    res.status(201).json({
      msg: 'Asset created successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// READ Assets
router.route("/").get(async (req, res, next) => {
  console.log('all called.......................................................................')
  try {
    const newdata = await cllBc()
    res.status(200).json(newdata)
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
  console.log(' ENDEEEEEEEEED     all called..........................................' )
});

// Get Single Asset
router.route("/get-asset/:id").get(async (req, res, next) => {
  console.log(req.params.id);
  try {
    const newdata = await GetAssetDetails(req.params.id);
    console.log(newdata);
    res.status(200).json(newdata);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});



// Delete Asset
router.route("/delete-Asset/:id").delete(async (req, res, next) => {
  console.log(req.params.id)
  try {
    await DeleteAssetBC(req.params.id);
    res.status(200).json({
      msg: 'Asset deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Transfer Asset
// Update Asset
router.route("/update-Asset/:id").put(async (req, res, next) => {
  console.log(req.body)
  try {
    await UpdateAssetBC(req.params.id, req.body);
    res.status(200).json({
      msg: 'Asset updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Transfer Asset
router.route("/transfer-Asset").post(async (req, res, next) => {
  console.log(req.body.ID, req.body.newOwner)
  try {
    await TransferAssetBC(req.body.ID, req.body.newOwner);
    res.status(200).json({
      msg: 'Asset transferred successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;