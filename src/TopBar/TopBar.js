import React, { useEffect, useState } from "react";
import ResultatListe from "../Kodetre/Kodeliste/ResultatListe";
import LookupControl from "../LookupControl/LookupControl";
import axios from "axios";

// Ny fancy

const TopBar = () => {
  const [hits, setHits] = useState([]);
  const [query, setQuery] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("https://ogapi.artsdatabanken.no/" + query);
      setHits(result.data.result);
    };
    fetchData();
  }, [query]);
  return (
    <>
      <LookupControl onQueryChange={e => setQuery(e.target.value)} />
      <ResultatListe query={query} searchResults={hits} />
    </>
  );
};

export default TopBar;
