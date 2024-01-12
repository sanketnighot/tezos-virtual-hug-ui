'use client';
import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { dappClient } from '../utils/walletconnect'
import { getHuxBalance, sendHug } from '../utils/contract_call'
import { EXPLORER } from '../utils/config'

export default function Home() {
	const [account, setAccount] = useState();
	const [toAddress, setToAddress] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [transactionMsg, setTransactionMsg] = useState('')
	const [isTxn, setIsTxn] = useState(false)

	useEffect(() => {
		(async () => {
			// TODO 5.b - Get the active account
			const accounts = await dappClient().getAccount();
			setAccount(accounts.account?.address);
		})();
	}, []);

	const onSendHugClick = async () => {
		setIsError(false)
		setIsSuccess(false)
		setIsTxn(true)
		setTransactionMsg("Connecting to Wallet")
		await dappClient().connectAccount();
		const accounts = await dappClient().getAccount();
		setAccount(accounts.account?.address);
		setTransactionMsg(`Wallet Connected. Sending a Hug to ${toAddress}`)
		const send_hug = await sendHug(toAddress)
		setIsTxn(false)
		if (send_hug) {
			setIsSuccess(true)
			setIsTxn(false)
			setTransactionMsg(`${EXPLORER}/${send_hug}`)
		}
		else {
			setIsError(true)
			setIsTxn(false)
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
				{isTxn && <InfoAlert transactionMsg={transactionMsg} />}
				{isSuccess && <SuccessAlert transactionMsg={transactionMsg} setIsSuccess={setIsSuccess} />}
				{isError && <ErrorAlert setIsError={setIsError} />}
			</main>
			{/* <SuccessToast /> */}
			{/* <ErrorToast /> */}
		</div>
	)
}


const InfoAlert = ({ transactionMsg }) => {
	return (
		<div id="alert-additional-content-1" class="p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50" role="alert">
			<div class="flex items-center">
				<svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-lg font-medium">Your Transaction is in process, Please Wait ...</h3>
			</div>

			<div class="mt-2 mb-4 text-sm">
				- {transactionMsg}
			</div>
		</div>
	)
}

const SuccessAlert = ({ transactionMsg, setIsSuccess }) => {
	return (
		<div id="alert-additional-content-3" class="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50" role="alert">
			<div class="flex items-center">
				<svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-lg font-medium">Your Hug was Delivered Successfully</h3>
			</div>
			<div class="mt-2 mb-4 text-sm">
			</div>
			<div class="flex">
				<a href={transactionMsg} target="_blank">
					<div type="button" class="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
						<svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
							<path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
						</svg>
						View Transaction
					</div>
				</a>
				<button
					type="button"
					class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800"
					data-dismiss-target="#alert-additional-content-3"
					aria-label="Close"
					onClick={() => { setIsSuccess(false) }}>
					Dismiss
				</button>
			</div>
		</div>
	)
}

const ErrorAlert = ({ setIsError }) => {
	return (
		<div id="alert-additional-content-2" class="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50" role="alert">
			<div class="flex items-center">
				<svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-lg font-medium">There was an Error in the transaction</h3>
			</div>
			<div class="mt-2 mb-4 text-sm">
				- Check the transaction and Try Again
			</div>
			<div class="flex">
				<button
					type="button"
					class="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
					data-dismiss-target="#alert-additional-content-2"
					aria-label="Close"
					onClick={() => { setIsError(false) }}>
					Dismiss
				</button>
			</div>
		</div>
	)
}