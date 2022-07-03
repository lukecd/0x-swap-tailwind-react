import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Modal, Table, Button, Text } from "@nextui-org/react";

import {AiOutlineCloseSquare} from 'react-icons/ai';

/**
 * 
 * @returns A modal dialog showing a list of tokens from CoinGecko
 */
const TokenList = (props) => {
    const [tokens, setTokens] = useState([]);
    const tokenTable = useRef(null);
    const [selectedToken, setSelectedToken] = useState([]);
    const [selected, setSelected] = useState("");
    
    const closeDialog = () => {
        props.onClose(false);
    }

    const handleChange = (event) => {

        props.setTokenAddress(event.target.id);
        props.setTokenName(event.target.title);
        props.onClose(false);
        
    }

    // runs on page load.
    useEffect(() => {
        const populateForm = async () => {
            await queryCG()
              .then( returnValue => {console.log("query successful ", returnValue)})
              .catch(error => console.log(error));
          };
          populateForm();
        
    }, []);

    /**
     * Gets a list of tokens for the popup
     */
    const queryCG = async () => {
        const queryURL = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'

        const response = await fetch(queryURL);
        let tokens = await response.json();
        tokens = tokens.tokens;
        setTokens(tokens);
    }
    
    return (
        <div className="bg-[#029AD1]">
        <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={props.open}
            onClose={() => props.onClose(false)}
 
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                Pick A Token
                </Text>

            </Modal.Header>
            <Modal.Body>
  
            <Table
                aria-label="token list"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
                selectionMode="single"
                >
                <Table.Header>
                    <Table.Column>Logo</Table.Column>
                    <Table.Column>Token</Table.Column>
                </Table.Header>
                <Table.Body>
                    {tokens.map((token, i) => (
                        <Table.Row key={token.address} >
                        <Table.Cell >
                            <img src={token.logoURI} width='18' alt='token icon'/> 
                        </Table.Cell>
                        <Table.Cell>
                            <span id={token.address} title={token.name} onClick={handleChange}>{token.name}</span>
                        </Table.Cell>
                        </Table.Row>
                    ))} 
                </Table.Body>
                <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={10}
                    onPageChange={(page) => console.log({ page })}
                />
            </Table>

            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onPress={closeDialog}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}

export default TokenList