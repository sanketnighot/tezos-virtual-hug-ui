'use client';
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { dappClient } from '../utils/walletconnect'
import { getHuxBalance, sendHug } from '../utils/contract_call'

export default function Home() {
	const [account, setAccount] = useState();
	const [toAddress, setToAddress] = useState();

	useEffect(() => {
		(async () => {
			// TODO 5.b - Get the active account
			const accounts = await dappClient().getAccount();
			setAccount(accounts.account?.address);
		})();
	}, []);

	const onSendHugClick = async () => {
		await dappClient().connectAccount();
		const accounts = await dappClient().getAccount();
		setAccount(accounts.account);
		const send_hug = await sendHug(toAddress)
		if (send_hug) {
			// <SuccessToast />
			alert("Hug Sent Successfully")
		} else {
			// <ErrorToast />
			alert("An Error Occured! Try Again")
		}
	};

	const onDisconnectWallet = async () => {
		await dappClient().disconnectWallet();
		setAccount(false);
	};

	return (
		<div className={`${styles.container}`}>
			<Head>
				<title>Tezos Virtual Hug</title>
				<meta name="description" content="Send virtual hugs on the Tezos blockchain" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={`${styles.main} text-black font-mono`}>
				<h1 className={`${styles.title}`}>
					Tezos Virtual Hug
				</h1>

				<Image className="mb-4 mt-6" src="/hug.jpeg" alt="Hugs" width={250} height={150} />

				<p className={`${styles.description} mb-10 text-center justify-center`}>
					<strong>Tezos Virtual Hug</strong> is a decentralized application that allows you to send virtual hugs on the Tezos blockchain. Just enter the wallet address of someone you want to send a hug to and Send a Hug. The <strong>HUG</strong> will be sent to You and the Tezos address you entered in form of a Non-Fungible Token.
				</p>

				<h3 className="mb-3">Price to pay: <span className="font-semibold">1,000,000 $HUX</span></h3>

				<input
					type="text"
					id="default-input"
					placeholder="Send a HUG to ..."
					class="border border-white-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/6 p-2.5 mb-3 text-center placeholder-opacity-50"
					value={toAddress}
					onChange={(e) => { setToAddress(e.target.value) }}
				/>
				<button type="button" class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-3/6  justify-center"
					onClick={async () => { await onSendHugClick() }}><span class="flex justify-center text-center">
						Send a Hug&nbsp;
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
						</svg>
					</span></button>
				{account && <h3 className="mb-3 text-sm">
					<span className="underline cursor-pointer" onClick={async () => { await onDisconnectWallet() }}>
						Disconnect
					</span>
				</h3>}

			</main>
			{/* <SuccessToast /> */}
			{/* <ErrorToast /> */}
		</div>
	)
}


const SuccessToast = () => {
	return (
		<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 right-auto max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg mr-8 mb-8" role="alert">
			<div className="flex p-4">
				<div className="flex-shrink-0">
					<svg className="flex-shrink-0 h-4 w-4 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
				</div>
				<div className="ms-3">
					<p className="text-sm text-gray-700">
						Successfully updated!
					</p>
				</div>
			</div>
		</div>
	)
}

const ErrorToast = () => {
	return (
		<div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 right-auto max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg mr-8 mb-8" role="alert">
			<div className="flex p-4">
				<div className="flex-shrink-0">
					<svg class="flex-shrink-0 h-4 w-4 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
					</svg>
				</div>
				<div className="ms-3">
					<p className="text-sm text-gray-700">
						An Error Occured! Try again
					</p>
				</div>
			</div>
		</div>
	)
}