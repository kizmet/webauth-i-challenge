import React from "react";
import { Layout, Form } from "antd";
import "./App.css";
import NormalLoginForm from "./NormalLoginForm";
import RegistrationForm from "./RegistrationForm";
const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
	NormalLoginForm
);

const WrappedRegistrationForm = Form.create({ name: "register" })(
	RegistrationForm
);

//const App = () => <WrappedNormalLoginForm />;

const App = () => {
	return (
		<Layout style={{ padding: 24 }}>
			<WrappedNormalLoginForm />;{/* <WrappedRegistrationForm /> */}
		</Layout>
	);
};

export default App;
