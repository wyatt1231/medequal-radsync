import styled from "styled-components";

export const UserProfileUi = styled.div`
  margin-left: 1em;
  color: black;
  .header {
    display: grid;
    grid-auto-flow: column;
    grid-template-areas: "image icon";
    align-items: center;
    align-content: center;

    &:hover {
      cursor: pointer;

      .profile-image,
      .icon {
        transition: 0.3s all ease-in-out;
      }
    }
    .profile-image {
      grid-area: image;
      height: 30px;
      width: 30px;
    }

    .icon {
      display: grid;
      grid-area: icon;
      justify-self: start;
      align-self: center;
      align-content: center;
      align-items: center;
    }
  }
`;

export const UserProfilePopOverUi = styled.div`
  width: 250px;
  min-width: 250px;
  .content-header {
    overflow: hidden;
    display: grid;
    grid-auto-flow: column;
    align-content: center;
    justify-content: start;
    align-items: center;
    justify-items: start;
    grid-gap: 0.5em;
    padding: 1em;
    grid-auto-columns: auto 1fr 100px;
    background-color: #f5f5f5;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.1);

    .content-header-image {
      height: 45px;
      width: 45px;
    }
    .content-header-user {
      text-transform: capitalize;

      .name {
        font-weight: 700;
      }

      .designation {
        /* opacity: 0.7 !important; */
        /* font-weight: 900 !important; */
        text-transform: capitalize !important;
      }
    }

    .btn-logout {
      color: #fff;
    }
  }

  .content-body {
    padding: 1em;

    .content-title {
      font-weight: 900;
      color: black;
      opacity: 0.6;
      font-size: 0.9em;
    }
    .content-items {
      margin-top: 0.5em;
      display: grid;
      grid-gap: 0.5em;
    }
    .link {
      padding: 0.2em 0.3em;
      box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.1) !important;
      color: #333 !important;
      cursor: pointer;
      &:hover {
        color: ${p => p.theme.palette.primary.main} !important;
      }
    }
  }
`;
