import { verifyMessage } from 'ethers';

export const verifySignature = (address: string, signature: string, nonce: string): boolean => {
  const signerAddress = verifyMessage(nonce, signature);
  return signerAddress === address;
};
