import type { MetaFunction } from '@remix-run/node';
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
} from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';
import adyenStyle from '@adyen/adyen-web/dist/adyen.css';

export const links = () => [
	{
		rel: 'stylesheet',
		href: globalStylesUrl,
	},
	{
		rel: 'stylesheet',
		href: adyenStyle,
	},
];

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Remix App',
	viewport: 'width=device-width,initial-scale=1',
});

const Layout = ({ children }: any) => {
	return (
		<>
			<nav className="navbar">
				<Link to={{ pathname: '/' }} className="logo">
					Remix
				</Link>
				<ul className="nav">
					<li>
						<Link to={{ pathname: '/adyen/orders' }}>Adyen</Link>
					</li>
					<li>
						<Link to={{ pathname: '/xendit/orders' }}>Xendit</Link>
					</li>
					<li>
						<Link to={{ pathname: '/midtrans/orders' }}>Midtrans</Link>
					</li>
				</ul>
			</nav>
			<div className="container">{children}</div>
		</>
	);
};

const Document = ({ children, title }: any) => {
	return (
		<html lang="en">
			<head>
				<Links />
				<Meta />
				{/* MIDTRANS */}
				<script
					type="text/javascript"
					src="https://app.sandbox.midtrans.com/snap/snap.js"
					data-client-key="SB-Mid-client-1fuVjw6Qpb83kttL"
				></script>
			</head>
			<body>
				{children}
				{process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
			</body>
		</html>
	);
};

export default function App() {
	return (
		<Document>
			<Layout>
				<Outlet />
				<Scripts />
			</Layout>
		</Document>
	);
}

/**
 * jika ada error di sebuah roout, maka akan menjalankan ErrorBoundary
 * ErrorBoundary di root.tsx akan menjadi error boundary untuk semua routes
 * ErrorBoundary juga bisa di define di masing-masing routes, remix akan mengambil ErrorBoundary terdekat
 */
export function ErrorBoundary({ error }: any) {
	console.log(error);
	return (
		<Document>
			<Layout>
				<h1>Error</h1>
				<p>{error.message}</p>
			</Layout>
		</Document>
	);
}
