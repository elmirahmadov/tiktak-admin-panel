import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, notification, Typography } from "antd";

import { useAuthActions } from "@/common/store/auth";
import { ROUTER } from "@/common/constants/router";

import styles from "./AdminLogin.module.css";

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
      <div className={styles.leftSection}>
        <div className={styles.illustration}>
          <div className={styles.adminIcon}></div>
          <div className={styles.dashboardGraphics}>
            <div className={styles.chartBars}>
              <div className={`${styles.bar} ${styles.bar1}`}></div>
              <div className={`${styles.bar} ${styles.bar2}`}></div>
              <div className={`${styles.bar} ${styles.bar3}`}></div>
              <div className={`${styles.bar} ${styles.bar4}`}></div>
            </div>
            <div className={styles.pieChart}>
              <div className={styles.pieSegment1}></div>
              <div className={styles.pieSegment2}></div>
              <div className={styles.pieSegment3}></div>
            </div>
            <div className={styles.lineChart}>
              <svg viewBox="0 0 100 40" className={styles.lineSvg}>
                <polyline
                  points="10,30 25,20 40,25 55,15 70,20 85,10"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          <div className={styles.decorativeElements}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.gear1}>⚙️</div>
            <div className={styles.gear2}>⚙️</div>
          </div>
        </div>
        <Title level={3} className={styles.illustrationTitle}>
          Admin Control Panel
        </Title>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <Title level={2} className={styles.mainTitle}>
              TIK TAK ADMİN
            </Title>
            <Text className={styles.subtitle}>Admin Panel</Text>
          </div>

          <Form
            form={form}
            name="adminLogin"
            onFinish={handleLogin}
            autoComplete="off"
            layout="vertical"
            className={styles.loginForm}
          >
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Lütfen telefon numaranızı girin!" },
                {
                  pattern: /^[0-9+\-\s()]+$/,
                  message: "Geçerli bir telefon numarası girin!",
                },
              ]}
            >
              <Input
                placeholder="+994 XX XXX XX XX"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Lütfen parolunuzu girin!" },
                { min: 6, message: "Parol en az 6 karakter olmalıdır!" },
              ]}
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
