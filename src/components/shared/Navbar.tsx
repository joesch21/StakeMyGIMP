"use client";

import { client } from "@/consts/client";
import { useGetENSAvatar } from "@/hooks/useGetENSAvatar";
import { useGetENSName } from "@/hooks/useGetENSName";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import { SideMenu } from "./SideMenu";
import { useRouter } from "next/navigation";
import styles from "../../styles/Navbar.module.css";

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box className={styles.navbarContainer} py="30px" px={{ base: "20px", lg: "50px" }}>
      <Flex className={styles.navbarFlex} direction="row" justifyContent="space-between">
        <Flex direction="row" alignItems="center">
          {/* Branding Title */}
          <Box my="auto" className={styles.branding} mr="20px">
            <Heading
              as={Link}
              href="/"
              className={styles["glitter-text"]}
              _hover={{ textDecoration: "none" }}
              fontWeight="extrabold"
            >
              Ock's Gimporium
            </Heading>
          </Box>
          {/* Container for stacking buttons vertically */}
          <Flex direction={{ base: "column", md: "column", lg: "row" }} alignItems="center" gap="10px">
            {/* Go Back Button */}
            <Button
              className={styles.collectionButton}
              onClick={() => router.back()}
              bg="transparent"
              border="2px solid #FFF"
              _hover={{ backgroundColor: "#333", color: "#FFF" }}
            >
              Go Back
            </Button>

            {/* "See My NFTs" Button placed between "Go Back" and "Buy GCC Tokens" */}
            <Link href="/profile">
              <Button
                size="md"
                bgGradient="linear(to-r, #7928CA, #FF0080)"
                color="white"
                fontWeight="bold"
                _hover={{ bgGradient: "linear(to-l, #7928CA, #FF0080)" }}
              >
                See My NFTs
              </Button>
            </Link>

            {/* Buy GCC Tokens Button */}
            <Link href="/purchase">
              <Button size="md" bg="yellow.400" color="black" _hover={{ bg: "yellow.500" }}>
                Buy GCC Tokens
              </Button>
            </Link>
          </Flex>
        </Flex>

        <Box display={{ lg: "block", base: "none" }}>
          <ToggleThemeButton />
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <ConnectButton
              client={client}
              theme={colorMode}
              connectButton={{ style: { height: "20px" } }}
            />
          )}
        </Box>
        <SideMenu />
      </Flex>
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const { colorMode } = useColorMode();
  return (
    <Menu>
      <MenuButton as={Button} height="56px">
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image src={ensAvatar ?? ""} height="40px" rounded="8px" />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem display="flex">
          <Box mx="auto">
            <ConnectButton client={client} theme={colorMode} />
          </Box>
        </MenuItem>
        <MenuItem as={Link} href="/profile" _hover={{ textDecoration: "none" }}>
          SEE NFT IN YOUR WALLET {ensName ? `(${ensName})` : ""}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Button>
  );
}
