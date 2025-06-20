import styles from "./styles.module.css";
import ButtonCustom from "../Button";

import WarningIcon from "@/assets/icons/svg/WarningIcon.svg?react";
import { logout } from "@/common/helpers/instance";

export default function NoPermission() {
  return (
    <>
      <div className={styles.no_permission_box}>
        <WarningIcon />
        <h1>Insufficient Permissions</h1>
        <p>Your current role does not allow access to this section. </p>
        <ButtonCustom variant={"dark"} onClick={logout}>
          Log out
        </ButtonCustom>
      </div>
    </>
  );
}
