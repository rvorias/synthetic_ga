// Imports
const fs = require("fs");
const crypto = require("crypto");
const keccak = require("keccak");
const keccak256 = require('keccak256')
const web3 = require('web3');
const secp256k1 = require("secp256k1");

var BN = web3.utils.BN;

const bn_21 = new BN("21");
const bn_16 = new BN("16");

const generateWallet = () => {
  const privateKeyBytes = crypto.randomBytes(32);
  const pub = secp256k1.publicKeyCreate(privateKeyBytes, false).slice(1);
  const address = keccak("keccak256")
    .update(pub)
    .digest()
    .slice(-20)
    .toString("hex");

  return {
    address,
    privateKey: privateKeyBytes.toString("hex"),
  };
};

/**
 * Checks if an address has a Divine Robe via Synthetic Loot
 * @param {string} address to check
 * @returns {bool} true/false status
 */
const checkNatural = async (address) => {
  const chest = await get_items(address);
  return chest;
};

const suffixes = [
    // <no suffix>          // 0
    "of Power",             // 1
    "of Giants",            // 2
    "of Titans",            // 3
    "of Skill",             // 4
    "of Perfection",        // 5
    "of Brilliance",        // 6
    "of Enlightenment",     // 7
    "of Protection",        // 8
    "of Anger",             // 9
    "of Rage",              // 10
    "of Fury",              // 11
    "of Vitriol",           // 12
    "of the Fox",           // 13
    "of Detection",         // 14
    "of Reflection",        // 15
    "of the Twins"          // 16
];
    
function toHex(str) {
    var result = '0x';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
  }

const weapon_hex = toHex("WEAPON");
const chest_hex = toHex("CHEST");
const head_hex = toHex("HEAD");
const waist_hex = toHex("WAIST");
const foot_hex = toHex("FOOT");
const hand_hex = toHex("HAND");
const neck_hex = toHex("NECK");
const ring_hex = toHex("RING");

function getWeapon(walletAddress) {
  return pluckName(walletAddress, weapon_hex); // WEAPON
}

function getChest(walletAddress) {
  return pluckName(walletAddress, chest_hex); // CHESt
}

function getHead(walletAddress) {
  return pluckName(walletAddress, head_hex); // HEAD
}

function getWaist(walletAddress) {
  return pluckName(walletAddress, waist_hex); //WAIST
}

function getFoot(walletAddress) {
  return pluckName(walletAddress, foot_hex); //FOOT
}

function getHand(walletAddress) {
  return pluckName(walletAddress, hand_hex); //HAND
}

function getNeck(walletAddress) {
  return pluckName(walletAddress, neck_hex); //NECK
}

function getRing(walletAddress) {
  return pluckName(walletAddress, ring_hex); //RING
}

function modd(a, b) {
    return parseInt(a.umod(b).toString());
}

function pluckName(walletAddress, keyPrefix) {
    const rand = keccak256(keyPrefix + walletAddress.slice(2));
    const bn_rand = new BN(rand);
    if (modd(bn_rand, bn_21) > 14) {
        return suffixes[modd(bn_rand, bn_16)];
    }
    return "x";
}

function get_items(wallet) {
    wallet = "0x" + wallet
    let goal = ''
    let flag = getNeck(wallet);
    if (flag != "x") {
        goal = flag;
    }
    else {
        return 0;
    }
    if (getChest(wallet) == goal) {
        if (getHead(wallet) == goal) {
            if (getWaist(wallet) == goal) {
                if (getFoot(wallet) == goal) {
                    if (getHand(wallet) == goal) {
                        if (getRing(wallet) == goal) {
                            if (getWeapon(wallet) == goal) {
                                return 8;
                            }
                            else {
                                return 7;
                            }
                        }
                        else {
                            return 6;
                        }
                    }
                    else {
                        return 5;
                    }
                }
                else {
                    return 4;
                }
            }
            else {
                return 3;
            }
        }
        else {
            return 2;
        }
    }
    return 1;
}

// console.log("4:");
// console.log(get_items("fc1f71e4f981ac0a7e454ba91d22ef0f527978c4"));

// console.log("5:");
// console.log(get_items("af4089023e550ac8a924e4ae714ce6ef4d751815"));

// console.log("6:");
// console.log(get_items("73b70457b0497ba88c89136540fe76abcd08615b"));

// console.log("7:");
// console.log(get_items("4330843dc108f4d5c2db34cffe4f9c8d7673c202"));

(async () => {
    // Inifinite loop
    for (let i = 0; i < process.argv[2]; i++) {
      // Generate wallet
      const { address, privateKey } = generateWallet();

      const isNatural = await checkNatural(address);

      if (isNatural == 5) {
        // Save wallet with divine robe
        console.log("Found wallet with at least 5 same-order items, saving!");
        console.log(isNatural);
        await fs.appendFileSync(
          "./5.txt",
          `${address}: ${privateKey}\n`
        );
      }
      if (isNatural == 6) {
        // Save wallet with divine robe
        console.log("Found wallet with at least 6 same-order items, saving!");
        console.log(isNatural);
        await fs.appendFileSync(
          "./6.txt",
          `${address}: ${privateKey}\n`
        );
      }
      if (isNatural == 7) {
        // Save wallet with divine robe
        console.log("Found wallet with 7 same-order items, saving!");
        console.log(isNatural);
        await fs.appendFileSync(
          "./7.txt",
          `${address}: ${privateKey}\n`
        );
      }
      if (isNatural == 8) {
        // Save wallet with divine robe
        console.log("JACKPOT");
        console.log(isNatural);
        await fs.appendFileSync(
          "./8.txt",
          `${address}: ${privateKey}\n`
        );
        break;
      }
    }
})();