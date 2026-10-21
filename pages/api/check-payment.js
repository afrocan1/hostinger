import { CHAINS } from "@/lib/chains";

const matches = (got, expected) => Math.abs(got - expected) < 0.000005;

async function checkEvm(c, expected, sinceMs) {
  const url =
    `https://api.etherscan.io/v2/api?chainid=${c.chainId}&module=account&action=tokentx` +
    `&contractaddress=${c.token}&address=${c.address}&page=1&offset=50&sort=desc` +
    `&apikey=${process.env.ETHERSCAN_API_KEY}`;
  const data = await (await fetch(url)).json();
  if (!Array.isArray(data.result)) return null;
  const tx = data.result.find(
    (t) =>
      t.to.toLowerCase() === c.address.toLowerCase() &&
      Number(t.timeStamp) * 1000 >= sinceMs &&
      Number(t.confirmations) >= 3 &&
      matches(Number(t.value) / 10 ** Number(t.tokenDecimal), expected)
  );
  return tx ? tx.hash : null;
}

async function checkTron(c, expected, sinceMs) {
  const url =
    `https://api.trongrid.io/v1/accounts/${c.address}/transactions/trc20` +
    `?only_to=true&limit=50&contract_address=${c.token}&min_timestamp=${sinceMs}`;
  const headers = process.env.TRONGRID_API_KEY
    ? { "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY }
    : {};
  const data = await (await fetch(url, { headers })).json();
  const tx = (data.data || []).find((t) => matches(Number(t.value) / 1e6, expected));
  return tx ? tx.transaction_id : null;
}

async function rpc(method, params) {
  const r = await fetch(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  return (await r.json()).result;
}

async function checkSolana(c, expected, sinceMs) {
  const accts = await rpc("getTokenAccountsByOwner", [c.address, { mint: c.token }, { encoding: "jsonParsed" }]);
  const ata = accts?.value?.[0]?.pubkey;
  if (!ata) return null;
  const sigs = await rpc("getSignaturesForAddress", [ata, { limit: 25 }]);
  for (const s of sigs || []) {
    if (s.err || !s.blockTime || s.blockTime * 1000 < sinceMs) continue;
    const tx = await rpc("getTransaction", [
      s.signature,
      { encoding: "jsonParsed", maxSupportedTransactionVersion: 0, commitment: "finalized" },
    ]);
    if (!tx?.meta) continue;
    const pick = (arr) => (arr || []).find((b) => b.owner === c.address && b.mint === c.token);
    const pre = pick(tx.meta.preTokenBalances)?.uiTokenAmount.uiAmount || 0;
    const post = pick(tx.meta.postTokenBalances)?.uiTokenAmount.uiAmount || 0;
    if (matches(post - pre, expected)) return s.signature;
  }
  return null;
}

export default async function handler(req, res) {
  const { chain, amount, since } = req.query;
  const c = CHAINS[chain];
  const expected = Number(amount);
  const sinceMs = Number(since);
  if (!c || !expected || !sinceMs) return res.status(400).json({ error: "bad request" });

  try {
    const fn = { evm: checkEvm, tron: checkTron, solana: checkSolana }[c.type];
    const txHash = await fn(c, expected, sinceMs);
    return res.status(200).json({ paid: !!txHash, txHash });
  } catch (e) {
    return res.status(200).json({ paid: false });
  }
}
