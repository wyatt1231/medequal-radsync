import styled from "styled-components";

const LoginPageUi = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  max-width: 100vw;
  display: grid;
  grid-auto-columns: 1fr 450px;
  grid-template-areas: "slider form";

  .slider-ctnr {
    grid-area: slider;
  }

  .form-ctnr {
    grid-area: form;
    display: grid;
    justify-content: center;
    grid-gap: 1em;
    /* align-content: start; */
    /* align-items: start; */
    padding: 1.5em 3em;
    .brand-ctnr {
      align-self: start;
      display: grid;

      justify-content: center;
      /* justify-items: center; */
      grid-gap: 0.5em;
      align-content: start;
      align-items: start;
      text-align: center;

      .brand-logo {
        justify-self: center;
        height: 3em;
        width: 3em;
      }

      .brand-name {
        font-weight: 500;
      }

      .app-name {
        justify-self: center;
        font-weight: 900;
      }
    }

    .login-input-group-ctnr {
      align-self: center;
      .login-text {
        font-weight: 600;
      }

      .MuiButton-root {
        border-radius: 50px !important;
      }
    }

    .form-footer {
      text-align: center;
      align-self: end;
    }
  }

  /*  */
  @media all and (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    grid-auto-flow: row;
    grid-auto-columns: auto;
    grid-template-areas: "form";

    .slider-ctnr {
      grid-area: form;
      max-width: 100vw;
    }

    .form-ctnr {
      z-index: 1;
      background-color: #fff !important;
      opacity: 0.9;

      padding: 1em 1em;
    }
  }
`;

export default LoginPageUi;
