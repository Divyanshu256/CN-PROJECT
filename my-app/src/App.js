import React, { useState } from 'react';
import './App.css';
// import sample from './sample.mp4';
import video1 from 'C:/Users/HP/Desktop/cn pro/my-app/src/component/video1.js';
function App() {
  <video1/>
  const [ipAddress, setIpAddress] = useState('');
  const [classfulSubnet, setClassfulSubnet] = useState({});
  const [cidrNotation, setCidrNotation] = useState('');
  const [classlessSubnet, setClasslessSubnet] = useState({});
  
  const calculateClassfulSubnet = () => {
    const octets = ipAddress.trim().split('.');
    const firstOctet = parseInt(octets[0]);

    let subnetClass;
    let subnetMask;
    let networkID;
    let hostID;

    if (firstOctet >= 1 && firstOctet <= 126) {
      subnetClass = 'A';
      subnetMask = '255.0.0.0';
      networkID = `${octets[0]}.0.0.0`;
      hostID = `${octets[1]}.${octets[2]}.${octets[3]}`;
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      subnetClass = 'B';
      subnetMask = '255.255.0.0';
      networkID = `${octets[0]}.${octets[1]}.0.0`;
      hostID = `${octets[2]}.${octets[3]}`;
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      subnetClass = 'C';
      subnetMask = '255.255.255.0';
      networkID = `${octets[0]}.${octets[1]}.${octets[2]}.0`;
      hostID = `${octets[3]}`;
    } else {
      subnetClass = 'Unknown';
      subnetMask = 'Unknown';
      networkID = 'Unknown';
      hostID = 'Unknown';
    }

    const networkAddress = ipAddress;
    const broadcastAddress = ipAddress.replace(/\d+$/, '255');
    const ipRange = networkAddress + ' - ' + broadcastAddress;

    setClassfulSubnet({
      subnetClass,
      subnetMask,
      networkID,
      hostID,
      ipRange,
    });
  };

  const calculateClasslessSubnet = () => {
    const subnetBits = parseInt(cidrNotation.trim().substr(1));
    const subnetMaskBinary = '1'.repeat(subnetBits) + '0'.repeat(32 - subnetBits);
    const subnetMask = binaryToIP(subnetMaskBinary);
    const subnetCount = Math.pow(2, 32 - subnetBits);
    const usableHosts = subnetCount > 2 ? subnetCount - 2 : 0;

    const octets = ipAddress.trim().split('.');
    const networkAddressBinary = ipToBinary(ipAddress);
    const networkAddressNetworkBits = networkAddressBinary.substr(0, subnetBits);
    const networkAddressNetwork = binaryToIP(networkAddressNetworkBits);

    const networkID = networkAddressNetwork;
    const hostID = `${octets[subnetBits >> 3]}.${octets[subnetBits >> 3 + 1]}.${octets[subnetBits >> 3 + 2]}`;

    setClasslessSubnet({
      subnetMask,
      subnetCount,
      usableHosts,
      networkID,
      hostID,
    });
  };

  const ipToBinary = (ipAddress) => {
    const octets = ipAddress.split('.');
    let binaryIP = '';

    octets.forEach((octet) => {
      const binaryOctet = parseInt(octet, 10).toString(2).padStart(8, '0');
      binaryIP += binaryOctet;
    });

    return binaryIP;
  };

  const binaryToIP = (binaryIP) => {
    let ipAddress = '';

    for (let i = 0; i < 32; i += 8) {
      const octet = binaryIP.substr(i, 8);
      const decimalOctet = parseInt(octet, 2);
      ipAddress += decimalOctet;

      if (i < 24) {
        ipAddress += '.';
      }
    }

    return ipAddress;
  };

  return (
    <div>
      <h1>Subnet Calculator</h1>

      <div>
        <h2>Classful Subnetting</h2>
        <label htmlFor="ip-address">IP Address:</label>
        <input
          type="text"
          id="ip-address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
        <button onClick={calculateClassfulSubnet}>Calculate</button>
        {classfulSubnet.subnetClass && (
          <div>
            <h3>Result</h3>
            <p>Subnet Class: {classfulSubnet.subnetClass}</p>
            <p>Subnet Mask: {classfulSubnet.subnetMask}</p>
            <p>Network ID: {classfulSubnet.networkID}</p>
            <p>Host ID: {classfulSubnet.hostID}</p>
            <p>Range of IP Addresses: {classfulSubnet.ipRange}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Classless Subnetting</h2>
        <label htmlFor="cidr">CIDR Notation:</label>
        <input
          type="text"
          id="cidr"
          value={cidrNotation}
          onChange={(e) => setCidrNotation(e.target.value)}
        />
        <button onClick={calculateClasslessSubnet}>Calculate</button>
        {classlessSubnet.subnetMask && (
          <div>
            <h3>Result</h3>
            <p>Subnet Mask: {classlessSubnet.subnetMask}</p>
            <p>Subnet Count: {classlessSubnet.subnetCount}</p>
            <p>Usable Hosts per Subnet: {classlessSubnet.usableHosts}</p>
            <p>Network ID: {classlessSubnet.networkID}</p>
            <p>Host ID: {classlessSubnet.hostID}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
