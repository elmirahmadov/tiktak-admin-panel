import React, { useState } from "react";

import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./AdminLogin.module.css";

import AdminControlPanelSVG from "@/assets/icons/svg/image.png";
import { ROUTER } from "@/common/constants/router";
import { useAuthActions } from "@/common/store/auth";

const { Title, Text } = Typography;

interface LoginFormData {
  phone: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);

    const loginData = {
      phone: values.phone,
      password: values.password,
    };

    login(
      loginData,
      () => {
        setLoading(false);

        setTimeout(() => {
          navigate(ROUTER.DASHBOARD);
        });
      },
      (error) => {
        console.error("Giriş hatası:", error);
        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleHeader}>
        <Title level={2} className={styles.mainTitle}>
          TIK TAK ADMİN
        </Title>
      </div>

      <div className={styles.leftSection}>
        <div className={styles.illustration}>
          <img
            src={AdminControlPanelSVG}
            alt="Admin Panel"
            style={{ width: "125%", height: "100%" }}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <Text className={styles.subtitle}>Admin Panel</Text>

          <Form
            form={form}
            name="adminLogin"
            onFinish={handleLogin}
            autoComplete="off"
            layout="vertical"
            className={styles.loginForm}
            requiredMark={false}
          >
            <Form.Item
              label={<span className={styles.labelText}>Telefon</span>}
              name="phone"
              rules={[
                { required: true, message: "Telefon nömrəsi girin!" },
                {
                  pattern: /^[0-9+\-\s()]+$/,
                  message: "Keçərli bir telefon nömrəsi girin!",
                },
              ]}
            >
              <Input
                placeholder="telefon"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              label={<span className={styles.labelText}>Parol</span>}
              name="password"
              rules={[{ required: true, message: "Parolunuzu girin!" }]}
            >
              <Input.Password
                placeholder="••••••••"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className={styles.loginButton}
                block
              >
                Daxil ol
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
