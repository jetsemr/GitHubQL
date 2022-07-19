import github from "./db.js";
import {useEffect, useState, useCallback } from "react";
import query from "./Query";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
// import NavButtons from "./NavButtons.js";

function App() {
  const [userName, setUserName] = useState("");
  const [repoList, setRepoList] = useState(null);
  const [pageCount, setPageCount] = useState(10);
  const [queryString, setQueryString] = useState("");
  const [totalCount, setTotalCount] = useState(null);

  {/*
  const [startCursor, setStartCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  */}
  const [paginationKeyword, setPaginationKeyword] = useState("first");
  const [paginationString, setPagionationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
    .then(response => response.json())
    .then(data => {
      const viewer = data.data.viewer;
      const repos = data.data.search.edges;
      const total = data.data.search.repositoryCount;
    {/*const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor;
      const next = data.data.search.pageInfo?.hasNextPage;
      const prev = data.data.search.pageInfo?.hasPreviousPage;*/}

      setUserName(viewer.name);
      setRepoList(repos); 
      setTotalCount(total);
    {/*setStartCursor(start);
      setEndCursor(end);
      setHasNextPage(next);
      setHasPreviousPage(prev);*/}
      console.log(data)
    })
    .catch((err) => {
      console.log(err);
    });
  }, [pageCount, queryString, paginationString, paginationKeyword]) /* if variables change useCallback will run again */ 
  
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  return (
    <div className="App container mt-5">
      <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i> Repos </h1>
      <p>{userName}</p>
      <SearchBox totalCount={totalCount} pageCount={pageCount} queryString={queryString} onQueryChange={(myString) => {setQueryString(myString)}} onTotalChange={(myNumber) => {setPageCount(myNumber)}}>
      </SearchBox>
      {/* <p><b>Search for:</b> {queryString} <b>Items per page:</b> {pageCount} <b>Total results:</b> {totalCount}</p> */}
      {/* 
      <NavButtons start={startCursor} end={endCursor} next={hasNextPage} previous={hasPreviousPage} onPage={(myKeyword, myString) => {
        setPaginationKeyword(myKeyword);
        setPagionationString(myString);
      }}></NavButtons>
      */}
      {repoList && (
        <ul className="list-group list-group-flush">
          {repoList.map((repo) => (<RepoInfo key={repo.node.id} repo={repo.node}></RepoInfo>
          ))}
        </ul>
      )

      }
    </div>
  );
}

export default App;
