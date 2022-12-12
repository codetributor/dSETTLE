import styled from "styled-components";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();

  const sendToNewListing = () => {
    router.push("new-listing");
  };
  return (
    <Container className="shadow-md border-gray-200 px-3 border-solid border-r scrollbar-hide bg-white sticky">
      <Header className="flex justify-between items-center py-3 cursor-pointer">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="pl-2">Account</h3>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Header>
      <div className="py-3 flex pl-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <SearchInput placeholder="search marketplace" />
      </div>
      <div className="py-3 pl-2">
        <h3>Filters</h3>
        <p className="text-blue-400 cursor-pointer">Honolulu, Hawaii</p>
      </div>
      <div className="py-3">
        <Button
          onClick={sendToNewListing}
          className="bg-blue-400 py-2 px-4 rounded-md text-white w-[320px]"
        >
          Create New Listing
        </Button>
      </div>
      <div className="py-3 pl-2 flex flex-col justify-center items-center">
        <h3>Categories</h3>
        <p className="text-blue-400 py-1 cursor-pointer">Apparel</p>
        <p className="text-blue-400 py-1 cursor-pointer">Electronics</p>
        <p className="text-blue-400 py-1 cursor-pointer">Entertainment</p>
        <p className="text-blue-400 py-1 cursor-pointer">Family</p>
        <p className="text-blue-400 py-1 cursor-pointer">Garden and Outdoor</p>
        <p className="text-blue-400 py-1 cursor-pointer">Hobbies</p>
        <p className="text-blue-400 py-1 cursor-pointer">Home Goods</p>
        <p className="text-blue-400 py-1 cursor-pointer">
          Home Improvement Supplies
        </p>
        <p className="text-blue-400 py-1 cursor-pointer">Musical Instruments</p>
        <p className="text-blue-400 py-1 cursor-pointer">Office Supplies</p>
        <p className="text-blue-400 py-1 cursor-pointer">Pet Supplies</p>
        <p className="text-blue-400 py-1 cursor-pointer">Sporting Goods</p>
        <p className="text-blue-400 py-1 cursor-pointer">Toys and Games</p>
      </div>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  background-color: white;
  overflow: scroll;
  height: 100vh;
  width: 350px;
  flex-shrink: 0;
`;

const Header = styled.div``;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  margin-left: 5px;
`;

const Button = styled.button`
  flex: 1;
`;
