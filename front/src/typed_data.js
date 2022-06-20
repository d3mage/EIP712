import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];


const spending = [
  { name: "name", type: "string" },
  { name: "to", type: "address" },
  { name: "amount", type: "uint256" },
];

const { chainId } = await provider.getNetwork();

const domain_data = {
  name: "EIP712",
  version: "1",
  chainId: chainId,
  verifyingContract: "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070",
};

function formMessage(spender, to, amount) {
  let message = {
    name: spender,
    to: to,
    amount: amount
  };
  return message;
}

async function formTypedData(spender, to, amount) {
  const message = formMessage(spender, to, amount);
  console.log(message)
  const typed_data = JSON.stringify({
    types: {
      EIP712Domain: domain,
      Spending: spending,
    },
    domain: domain_data,
    primaryType: "Spending",
    message: message,
  });
  return typed_data;
}

export async function sendSignedTypedData(spender, amount) {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const to = accounts[0];
  const typed_data = await formTypedData(spender, to, amount);

  const params = [to, typed_data];

  ethereum.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params,
      to,
    },
    function (err, result) {
      console.log("SIGNED: " + JSON.stringify(result.result));

      const signature = result.result.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);
      console.log("R: " + r);
      console.log("S: " + s);
      console.log("V: " + v);


    }
  );
}
