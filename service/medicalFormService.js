const fs = require('fs');
const path = require('path');
 
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
 
const ccpPath = path.resolve(__dirname, '..' , 'basic_articles', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
 
// Create a new CA client for interacting with the CA.
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new FabricCAServices(caURL);
 
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);

let pcodeCount=1;


///////////////////////////////////////////////////////////////
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/SmartHC';

module.exports={

    medicalFormInsertOne: async function(name,ssn,addr,email,visitDate,desease,deseaseCode,content,docterName,docterNo){
    try{
	console.log(`Wallet path: ${walletPath}`);
	const userExists = await wallet.exists('user1');
             if (!userExists) {
                  console.log('An identity for the user "user1" does not exist in the wallet');
                  await res.json({'msg':'Org1-user1 지갑이 없음'});
                  return;
              }
          
              // Create a new gateway for connecting to our peer node.
              const gateway = new Gateway();
              await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });
          
              // Get the network (channel) our contract is deployed to.
              const network = await gateway.getNetwork('mychannel');
          
              // Get the contract from the network.
              const contract = network.getContract('medicalreport');
          
	      let pcode="p"+pcodeCount++
              await contract.submitTransaction('createMedicalReport',pcode,name,ssn,addr,email,visitDate,desease,deseaseCode,content,docterName,docterNo);
              console.log('진료 확인서 BlockChain 저장 완료');
              



/////////////////////////// db /////////////// 
        MongoClient.connect(url, function(err,db){
            if(err){
                console.log(err);
            }else{                
                db = db.db('SmartHC'); /*database명을 다시 한번 명시했다. 이거 안 하면 에러남*/
                console.log('db connected...ok');
                db.collection('medicalForm').insertOne(
                    {
                        "name":name,
                        "ssn":ssn,
                        "addr":addr,
                        "email":email,
                        "visitDate":visitDate,
                        "desease":desease,
                        "deseaseCode":deseaseCode,
                        "content":content
                    },
                    (err, result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log('진료확인서 db 저장됨\n');
                            console.log(result);
                        }//end else
                        
                    }//end result
                );//end insertOne
            }//end else
        });//end connect
      }catch(e){
   	console.log(e);
	throw e;
      }//end catch
    }//end function
}//end exports
