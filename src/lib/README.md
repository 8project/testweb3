const onClickLogIn = async () => {
    try {
      const account = await window.ethereum.request({
        method : "eth_requestAccounts",
      });

      setAccount(account[0]);
    } catch (error) {
        console.error(error);
    }
  };

  const onClickContract = async () => {
    try {
      const CAName = await OGNftContract.methods.name().call();
      setCAName(CAName);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMint = async () => {
    try {
      const mintResponse = await OGNftContract.methods.mintNFT().send({from : account});
      
      if(Number(mintResponse.status) === 1) {
        const myNftResponse = await OGNftContract.methods.getLatestNft(account).call(); 

        const metadataResponse = await axios.get(`${PINATA_URL}/${Number(myNftResponse)}.json`);
        
        console.log(metadataResponse);
        setMetadataImage(metadataResponse.data.image)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBalanceOf = async () => {
    try {
      const response = await OGNftContract.methods.balanceOf(account).call();
      
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  /*
  nft 불러오기 : ownerOf사용해서 주인 불러오기 
  */
  const onClickOwnerOf = async () => {
    try {
      const response = await OGNftContract.methods.ownerOf(2).call();
      console.log(response);  
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div onClick={onClickLogIn}>account : {account}</div>
      <div onClick={onClickContract}>contract name : {CAName} </div>
      <div onClick={onClickMint}>Minting</div>
      <div onClick={onClickBalanceOf}>BalanceOf</div>
      <img src={`${metadataImage}`}></img>
      <div onClick={onClickOwnerOf}>OwnerOf TokenId : 1</div>
    </div>
  );