import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  border: none;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  margin-top: 3%;
  color: white;
  outline: none;
  
  &::placeholder {
    color: rgb(228, 215, 215);
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;



