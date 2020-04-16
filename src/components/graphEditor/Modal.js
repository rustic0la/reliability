import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

import Calculator from '../calculations/Calc';

const ModalWin = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<Button
				onClick={handleShow}
				variant="warning"
				disabled={false}
				style={{
					fontSize: '14px',
					padding: '3px',
					position: 'absolute',
					top: '3px',
					right: '15px',
				}}
			>
				Рассчитать
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Параметры эксплуатации</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ padding: '0', paddingBottom: '20px' }}>
					<Calculator />
				</Modal.Body>
			</Modal>
		</>
	);
};

export default ModalWin;
