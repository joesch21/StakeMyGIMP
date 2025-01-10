import { ADDRESS_ZERO, type NFT, type BaseTransactionOptions } from "thirdweb";
import { isERC721 } from "thirdweb/extensions/erc721";
import { detectMethod } from "thirdweb/utils";

export type GetERC721sParams = {
    owner: string;
    requestPerSec?: number;
};

/**
 * Fetches owned ERC-721 tokens for a given address.
 * Safely checks for the token enumeration extension and handles contracts without it.
 */
export async function getOwnedERC721s(
    options: BaseTransactionOptions<GetERC721sParams>,
): Promise<NFT[]> {
    const { contract, owner, requestPerSec } = options;

    // Fixed the type issue with assertion
    const [is721, has_tokenOfOwnerByIndex] = await Promise.all([
        isERC721({ contract }), // contract can be passed here since it's expected
        detectMethod({
            method: "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            availableSelectors: ["tokenOfOwnerByIndex(address,uint256)"] // Required property fixed
        })
    ]);
    
    
    

    if (!is721) {
        throw new Error("Contract is not an ERC721 contract");
    }

    if (has_tokenOfOwnerByIndex) {
        const { getOwnedNFTs } = await import("thirdweb/extensions/erc721");
        return getOwnedNFTs(options);
    }

    const { nextTokenIdToMint, startTokenId, totalSupply, ownerOf, getNFT } =
        await import("thirdweb/extensions/erc721");

    const [startTokenId_, maxSupply] = await Promise.allSettled([
        startTokenId(options),
        nextTokenIdToMint(options),
        totalSupply(options),
    ]).then(([_startTokenId, _next, _total]) => {
        const startTokenId__ =
            _startTokenId.status === "fulfilled" ? _startTokenId.value : 0n;
        let maxSupply_: bigint;
        if (_total.status === "fulfilled") {
            maxSupply_ = _total.value;
        } else if (_next.status === "fulfilled") {
            maxSupply_ = _next.value - startTokenId__;
        } else {
            throw new Error(
                "Contract requires either `nextTokenIdToMint` or `totalSupply` to determine the next token ID to mint"
            );
        }
        return [startTokenId__, maxSupply_] as const;
    });

    const allTokenIds = Array.from(
        { length: Number(maxSupply - startTokenId_ + 1n) },
        (_, i) => startTokenId_ + BigInt(i)
    );

    if (requestPerSec) {
        let owners: string[] = [];
        const tokenIdsArrays: bigint[][] = [];

        for (let i = 0; i < allTokenIds.length; i += requestPerSec) {
            const chunk = allTokenIds.slice(i, i + requestPerSec);
            tokenIdsArrays.push(chunk);
        }

        for (let i = 0; i < tokenIdsArrays.length; i++) {
            const data = await Promise.all(
                tokenIdsArrays[i].map((tokenId) =>
                    ownerOf({ contract, tokenId }).catch(() => ADDRESS_ZERO)
                ),
            );
            owners = owners.concat(data);
        }

        const ownedTokenIds = allTokenIds.filter(
            (tokenId, index) => owners[index].toLowerCase() === owner.toLowerCase(),
        );

        let ownedNFTs: NFT[] = [];
        const ownedTokenIdsArrays: bigint[][] = [];

        for (let i = 0; i < ownedTokenIds.length; i += requestPerSec) {
            const chunk = ownedTokenIds.slice(i, i + requestPerSec);
            ownedTokenIdsArrays.push(chunk);
        }

        for (let i = 0; i < ownedTokenIdsArrays.length; i++) {
            const data = await Promise.all(
                ownedTokenIdsArrays[i].map((tokenId) =>
                    getNFT({
                        ...options,
                        tokenId,
                    }).then((nft) => ({
                        ...nft,
                        owner,
                    })),
                ),
            );
            ownedNFTs = ownedNFTs.concat(data);
        }

        return ownedNFTs;
    } else {
        const owners = await Promise.all(
            allTokenIds.map((tokenId) =>
                ownerOf({ contract, tokenId }).catch(() => ADDRESS_ZERO)
            ),
        );

        const ownedTokenIds = allTokenIds.filter(
            (tokenId, index) => owners[index].toLowerCase() === owner.toLowerCase()
        );

        const promises = ownedTokenIds.map((tokenId) =>
            getNFT({
                ...options,
                tokenId,
            }).then((nft) => ({
                ...nft,
                owner,
            }))
        );

        return await Promise.all(promises);
    }
}
