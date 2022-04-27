import { Container } from '../styles/GlobalStyles';
import { InvalidURLDiv, PageNotFoundDiv } from '../styles/PageNotFoundStyles';

export const PageNotFound = () => (
  <Container>
    <PageNotFoundDiv>Page not found.</PageNotFoundDiv>
    <InvalidURLDiv>Invalid URL entered.</InvalidURLDiv>
  </Container>
);
