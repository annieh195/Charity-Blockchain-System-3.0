import { Box, Link, Flex } from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="transparent"
      position="absolute"
      top="0"
      right="0"
      left="0"
      zIndex="10"
      color="white"
    >
      <Box>
        <Link onClick={() => handleNavigate('/home')} cursor="pointer">
          ByteCoin
        </Link>
      </Box>
      {!isAuthPage && (
        <Box display="flex" alignItems="center">
          <Link onClick={() => handleNavigate('/home')} mx="2" cursor="pointer" color="blue.400">
            Home
          </Link>
          <Link onClick={() => handleNavigate('/create')} mx="2" cursor="pointer" color="blue.400">
            Create
          </Link>
          <Link onClick={() => handleNavigate('/profile')} mx="2" cursor="pointer" color="blue.400">
            Profile
          </Link>  
          <Link onClick={() => handleNavigate('/logout')} mx="2" cursor="pointer" color="blue.400">
            Logout
          </Link>
        </Box>
      )}
    </Flex>
  );
}

export default NavBar;

// import { Box, Link, Flex } from '@chakra-ui/react';
// import React from 'react';
// import { Link as RouterLink, useLocation } from 'react-router-dom';

// function NavBar() {
//   const location = useLocation();
//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

//   return (
//     <Flex
//       as="nav"
//       align="center"
//       justify="space-between"
//       wrap="wrap"
//       padding="1.5rem"
//       bg="transparent"
//       position="absolute"
//       top="0"
//       right="0"
//       left="0"
//       zIndex="10"
//     >
//       <Box>
//         <Link as={RouterLink} to="/home">
//           ByteCoin
//         </Link>
//       </Box>
//       {!isAuthPage && (
//         <Box display="flex" alignItems="center">
//           <Link as={RouterLink} to="/home" mx="2">
//             Home
//           </Link>
//           <Link as={RouterLink} to="/create" mx="2">
//             Create
//           </Link>
//           <Link as={RouterLink} to="/logout" mx="2">
//             Logout
//           </Link>
//         </Box>
//       )}
//     </Flex>
//   );
// }

// export default NavBar;
