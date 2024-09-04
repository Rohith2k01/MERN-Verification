'use client'
import PhoneVerification from "@/pages/components/phoneVerfication"
import EmailVerification from "@/pages/components/EmailVerification"
import AadhaarVerification from "@/pages/components/AadhaarVerification"
import PANVerification from "@/pages/components/PANVerification"
import BankAccountVerification from "@/pages/components/BankAccountVerification"
import GSTVerification from "@/pages/components/GSTVerification"
import PincodeVerification from "@/pages/components/PincodeVerification"

const reistration_page = ()=>{

    return(
    <>
      <div><PhoneVerification/></div>
      <div><EmailVerification/></div>
      <div><AadhaarVerification/></div>
      <div><PANVerification/></div>
      <div><BankAccountVerification/></div>
      <div><GSTVerification/></div>
      <div><PincodeVerification/></div>
    </>)
}

export default reistration_page
