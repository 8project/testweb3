import { useEffect, useState } from "react";
import ABI from "./lib/OGNftABI.json";
import MarketABI from "./lib/MarketABI.json";
import PieceMarketABI from "./lib/PieceMarketABI.json";
import Web3 from "web3";
import axios from "axios";


function App() {
  const [account, setAccount] = useState();
  const [tokenMetadata, setTokenMetadata] = useState();
  const [listPrice, setListPrice] = useState();
  const [tokenId, setTokenId] = useState();
  const [index,setIndex] = useState();


  const web3 = new Web3(window.ethereum);
  // const web3_2 = new Web3("wss://sepolia.infura.io/ws/v3/bd4f14b4116f4974b5d08009d9b368f0");

  const OGNFTContractAddress = "0x4945ca7DaeFc66Ef875d8209F526625E16f32292";
  const MarketContractAddress = "0xF2bB516e979F5202Eb0ef873ac98588d1C326Be8";
  const PieceMarketContractAddress = "0x739D55D23F46A8dF8d5A88AFD499b3cB6B5A7667";

  const OGNFTContract = new web3.eth.Contract(ABI, OGNFTContractAddress);
  const MarketContract = new web3.eth.Contract(MarketABI, MarketContractAddress);
  const PieceMarketContract = new web3.eth.Contract(PieceMarketABI, PieceMarketContractAddress);
  

  // const PINATA_URL = "https://olbm.mypinata.cloud/ipfs/QmU52T5t4bXtoUqQYStgx39DdXy3gLQq7KDuF1F9g3E9Qy";

  
  //완료
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

  //완료
  const onClickMint = async () => {
    try {
      const mintResponse = await OGNFTContract.methods.mintNFT().send({from : account});
      
      console.log(mintResponse);
    } catch (error) {
      console.error(error);
    }
  };
  //완료
  const onClickBalanceOf = async () => {
    try {
      const response = await OGNFTContract.methods.balanceOf(account).call();
      
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  //완료
  const onSubmitTokenURI = async(e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    let tokenId = web3.utils.numberToHex(Number(data.get("TokenIndex")));
    try {
      const response = await OGNFTContract.methods.tokenURI(tokenId).call();
      const metadataResponse = await axios.get(response); //attribute
      console.log(metadataResponse);
      setTokenMetadata(metadataResponse);
      // console.log(setTokenMetadata);
    } catch (error) {
      console.error(error);
    }
  };

  
  const onSubmitApprove = async(e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    
    let tokenId = web3.utils.numberToHex(Number(data.get("TokenId")));
    try {
      // console.log(account);
      const response = await OGNFTContract.methods.approve(MarketContractAddress,tokenId).send({from : account})
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  
  const onSubmitListForSale = async (e) => {
    e.preventDefault();

    let OGtokenId = Number(tokenId);

    let price = web3.utils.toWei(listPrice, "ether");
    try {
      const response = await MarketContract.methods.listForSale(OGNFTContractAddress, OGtokenId, price).send({from : account});
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  /*
  value 부분이 OG NFT의 1/20가격을 불러와야함
  */
  const onSubmitOGFunding = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    let OGListIndex = web3.utils.numberToHex(Number(data.get("IndexList")));
    try {
      const response = await MarketContract.methods.OGFunding(OGListIndex).send({from : account, value : web3.utils.toWei("0.5","ether")});
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  
  /*
  돈 받는건 돈받는애가 누르게 하자 
  자기 my page에서 누르게끔 
  */
  const onSubmitPriceToSeller = async(e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    let OGListIndex =  web3.utils.numberToHex(Number(data.get("IndexList")));
    try {
      const response = await MarketContract.methods.PriceToSeller(OGListIndex).send({from : account });
      console.log(response);
    } catch (error) {
      console.error(error);
    }    
  }
  /*
  history부분에다가 useEffect써서 붙이기 
  */
  const onClickOGListForSale_buyerList = async () => {
    try {
      const response = await MarketContract.methods.OGListForSale_buyerList(1).call();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  /*
  우석님이 적은 코드중에 마지막에 누른사람한테는 많이나가는 가스비만큼 돌려주기.<의견물어보기
  아니면 받는것도 개인이 직접 받는걸로?
  */
  const onSubmitDistributePiece = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    let OGListIndex =  web3.utils.numberToHex(Number(data.get("IndexList")));
    try {
      const response = await MarketContract.methods.distributePiece(OGListIndex).send({ from: account });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  //나중에
  const onClickOverDuration = async () => {
    try {
      const response = await MarketContract.methods.overDuration(1).send({ from: account });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  /*
  offering
  */
  const onSubmitOffering = async(e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    let OGListIndex =  web3.utils.numberToHex(Number(data.get("IndexList")));
    let _value =  web3.utils.numberToHex(Number(data.get("price")));
    try {
      const response = await MarketContract.methods.offering(OGListIndex).send({from :account, value : _value});
      console.log(response);
    } catch(error) {
      console.error(error);
    }
  }
  /*
  이건 따로 매니저 지갑에서 눌러줘야함 event emit필요 
  */
  const onClickGetBestOffer = async() => {
    try {
      const response = await MarketContract.methods.getBestOffer(1).send();
      console.log(response);
    } catch(error) {
      console.error(error);
    }
  }
  /*
  front에서 막아주기 
  */
  const onClickstartVote = async() => {
    try {
      const response = await MarketContract.methods.startVote(1, true).send();
      console.log(response);
    } catch(error) {
      console.error(error);
    }
  }
  /*
  프론트에서 막아주기
  */
  const onClickvoteResult = async() => {
    try {
      const response = await MarketContract.methods.voteResult(1).send();
      console.log(response);
    } catch(error) {
      console.error(error);
    }
  }
  /*
  
  */
  const onSubmitListPieceTokenForSale = async(e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    
    let PieceListIndex =  web3.utils.numberToHex(Number(data.get("PieceIndexList")));
    let price =  web3.utils.numberToHex(Number(data.get("price")));
    try {
      const response = await PieceMarketContract.methods.listPieceTokenForSale(PieceListIndex, web3.utils.toWei(price, "ether")).send({from : account });
      console.log(response);
    } catch (error) {
      console.error(error);
    }    
  }
  /*
  value값을 PieceNftList에서 가져오기 
  */
  const onClickBuyPieceToken = async() => {
    try {
      const response = await PieceMarketContract.methods.buyPieceToken(1).send({from : account, value : web3.utils.toWei("0.000055","ether")});
      console.log(response);
    } catch (error) {
      console.error(error);
    } 
  }

  const onClickCancelSale = async() => {
    try {
      const response = await PieceMarketContract.methods.cancelSale(1).send({from : account});
      console.log(response);
    } catch (error) {
      console.error(error);
    } 
  }

  

  return (
    <div>
      <div className="bg-red-100">
        <div className="flex justify-center text-5xl font-bold">OGNFT</div>
        <div onClick={onClickLogIn}>account : {account}</div>
        
        <div onClick={onClickMint}>Minting</div>

        <div onClick={onClickBalanceOf}>BalanceOf</div>
        
        <form onSubmit={onSubmitTokenURI}>
          <input type="text" name="TokenIndex"></input>
          <button>Get Token URI</button>
        </form>
        <div>
          {/* {tokenMetadata === undefined} () : () */}
        </div>
        <img src={tokenMetadata.data?.image} alt="NFTIMAGE"></img>
        <div>{tokenMetadata.data?.description}</div>
        <ul>
          {tokenMetadata.data?.attributes?.map((v,i)=> {
             return <div key={i}>{v.trait_type} {v.value}</div> 
           })} 
        </ul> 

        <form onSubmit={onSubmitApprove}>
          <input className=" mt-2" type="text" name ="TokenId"></input>
          <button>Approve NFT</button>
        </form>

      </div>
      <div className="bg-blue-100">
        <div className="flex justify-center text-5xl font-bold">Market</div>
          
        <form onSubmit={onSubmitListForSale}>
          <input className="mr-2" type ="text" value ={tokenId} onChange={(e) => setTokenId(e.target.value)}></input>
          <input className="mr-2" type ="text" value ={listPrice} onChange={(e) => setListPrice(e.target.value)}></input>
          <button>List For Sale</button>
        </form>
        <div className="bg-blue-300">
        <form onSubmit={onSubmitOGFunding}>
        <input className="mt-2" type="text" name = "ListIndex"></input>
          <button>OG Funding</button>
          <div>Price : 하드코딩될부분</div>
        </form>
        </div>
        {/* <div onClick={onClickPriceToSeller}>모인 금액 og판매자에게 넘겨주기</div> */}
        <form onSubmit={onSubmitPriceToSeller}>
          <input className="mt-2" type="text" name = "ListIndex"></input>
          <button>withdraw : 판매금액 회수</button>
        </form>
        <div onClick={onClickOGListForSale_buyerList}>투자자 리스트</div>
        
        <form onSubmit={onSubmitDistributePiece}>
          <input className="mt-2" type="text" name = "ListIndex"></input>
          <button>조각NFT 받기</button>
        </form>
        <div onClick={onClickOverDuration}>기간만료된 경우</div>
      </div>
      <div className="bg-purple-100">
        <div className="flex justify-center text-5xl font-bold">Vote</div>
        {/* <div onClick={onClickOffering}>offer :가격제안</div> */}
        <form onSubmit={onSubmitOffering}>
          <input className="mt-2 mr-2" type="text" name = "ListIndex"></input>
          <input className="mt-2 mr-2" type="text" name = "price"></input>
          <button>가격제안, 제안금액</button>
        </form>
        <div onClick={onClickGetBestOffer}>최고가격뽑기</div>
        <div onClick={onClickstartVote}>투표시작하기</div>
        <div onClick={onClickvoteResult}>투표 결과</div>
      </div>
      <div className="bg-orange-100">
        <div className="flex justify-center text-5xl font-bold">Piece Market</div>
        {/* <div onClick={onSubmitListPieceTokenForSale}>조각 NFT 등록 </div> */}
        <form onSubmit={onSubmitListPieceTokenForSale}>
        <input className="mt-2 mr-2" type="text" name = "PieceIndexList"></input>
          <input className="mt-2 mr-2" type="text" name = "price"></input>
        </form>
        <div onClick={onClickBuyPieceToken}>조각 구매 </div>
        {/* 347은 nft카드에 붙이면 됨 */}
        <div onClick={onClickCancelSale}>조각 판매 취소 </div>
      </div>
    </div>
  );
}
export default App;