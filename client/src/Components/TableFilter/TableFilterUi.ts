import styled from "styled-components";

export const StyledTableFilter = styled.div`
  /* background-color: #fafafa; */
  border-radius: 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  .filter-container {
    padding: 0.3em 0;
  }
  .filter-group {
    padding: 0.3em;
    margin: 1em 0;
    .filter-title {
      font-weight: 600;
      border-bottom: 2px solid rgba(0, 0, 0, 0.3);
      padding: 0.3em 0;
      /* margin-bottom: 0.5em; */
      font-size: 0.87em;
    }

    .filter-content {
      padding: 0.5em;
    }

    .filter-fields {
      .filter-field-group {
        .filter-field-group-label {
          font-weight: 600;
          font-size: 0.8em;
          margin-bottom: 1em;
        }
        .filter-field-group-content {
          display: grid;
          grid-gap: 1em;
        }
      }
    }
  }
  .actions {
    margin-top: 2em;
    display: grid;
    justify-items: center;
    align-items: center;
    align-content: center;
    grid-gap: 0.5em;
  }
`;

export const DrawerFilterUi = styled.div`
  padding: 1em;
  .filter-group {
    .filter-title {
      font-weight: 700;
      border-bottom: 2px solid rgba(0, 0, 0, 0.3);
      padding: 0.5em 0;
      margin-bottom: 0.5em;
    }

    .filter-fields {
      .filter-field-group {
        .filter-field-group-label {
          font-weight: 600;
          font-size: 0.8em;
          margin-bottom: 1em;
        }
        .filter-field-group-content {
          display: grid;
          grid-gap: 1em;
        }
      }
    }
  }
  .actions {
    margin-top: 1em;
    display: grid;
    justify-items: center;
    align-items: center;
    align-content: center;
    grid-gap: 0.5em;
  }
`;
