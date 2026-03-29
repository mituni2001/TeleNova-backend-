import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Input from "../components/Input";
import Button from "../components/Button";
import RadioGroup from "../components/RadioGroup";
import { addRSU, updateRSU } from "../services/api";
import { useLocalSearchParams } from "expo-router";

export default function RectifierForm() {
  const params = useLocalSearchParams();

  // ✅ Memoize record to prevent infinite render loop
  const record = useMemo(() => {
    if (!params?.record) return null;
    return JSON.parse(decodeURIComponent(params.record));
  }, [params.record]);

  /* ================= RSU BASIC ================= */
  const [rsuname, setRsuName] = useState("");
  const [remarks, setRemarks] = useState("");

  /* ================= PRIMARY RECTIFIER ================= */
  const [pType, setPType] = useState("");
  const [pDate, setPDate] = useState("");
  const [pModuleType, setPModuleType] = useState("");
  const [pWorking, setPWorking] = useState("");
  const [pFaulty, setPFaulty] = useState("");
  const [pCapacity, setPCapacity] = useState("");
  const [pLoad, setPLoad] = useState("");
  const [pPhase, setPPhase] = useState("");
  const [pNodes, setPNodes] = useState(["", "", "", ""]);

  /* ================= SECONDARY RECTIFIER ================= */
  const [sType, setSType] = useState("");
  const [sDate, setSDate] = useState("");
  const [sModuleType, setSModuleType] = useState("");
  const [sWorking, setSWorking] = useState("");
  const [sFaulty, setSFaulty] = useState("");
  const [sCapacity, setSCapacity] = useState("");
  const [sLoad, setSLoad] = useState("");
  const [sPhase, setSPhase] = useState("");
  const [sNodes, setSNodes] = useState(["", "", "", ""]);

  /* ================= CALCULATIONS ================= */
  const pTotalModules = useMemo(
    () => Number(pWorking || 0) + Number(pFaulty || 0),
    [pWorking, pFaulty]
  );
  const sTotalModules = useMemo(
    () => Number(sWorking || 0) + Number(sFaulty || 0),
    [sWorking, sFaulty]
  );
  const pLoadPct = useMemo(() => {
    if (!pCapacity) return 0;
    return ((Number(pLoad || 0) / Number(pCapacity)) * 100).toFixed(1);
  }, [pLoad, pCapacity]);
  const sLoadPct = useMemo(() => {
    if (!sCapacity) return 0;
    return ((Number(sLoad || 0) / Number(sCapacity)) * 100).toFixed(1);
  }, [sLoad, sCapacity]);

  const healthStatus = (pct) => {
    const val = Number(pct);
    if (val < 70) return "Healthy";
    if (val < 90) return "Warning";
    return "Critical";
  };

  const isValidDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);

  /* ================= LOAD EXISTING RECORD ================= */
  useEffect(() => {
    if (!record) return;

    setRsuName(record.rsuName || "");
    setRemarks(record.remarks || "");

    if (record.primaryRectifier) {
      const p = record.primaryRectifier;
      setPType(p.type || "");
      setPDate(p.installedDate || "");
      setPModuleType(p.moduleType || "");
      setPWorking(String(p.modules?.working || ""));
      setPFaulty(String(p.modules?.faulty || ""));
      setPCapacity(String(p.capacity || ""));
      setPLoad(String(p.dcLoad || ""));
      setPPhase(p.phase || "");
      setPNodes(
        p.connectedNodes && p.connectedNodes.length
          ? p.connectedNodes
          : ["", "", "", ""]
      );
    }

    if (record.secondaryRectifier) {
      const s = record.secondaryRectifier;
      setSType(s.type || "");
      setSDate(s.installedDate || "");
      setSModuleType(s.moduleType || "");
      setSWorking(String(s.modules?.working || ""));
      setSFaulty(String(s.modules?.faulty || ""));
      setSCapacity(String(s.capacity || ""));
      setSLoad(String(s.dcLoad || ""));
      setSPhase(s.phase || "");
      setSNodes(
        s.connectedNodes && s.connectedNodes.length
          ? s.connectedNodes
          : ["", "", "", ""]
      );
    }
  }, [record]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!rsuname || !pType) {
      Alert.alert("Error", "RSU Name & Primary Type required");
      return;
    }
    if (pDate && !isValidDate(pDate)) {
      Alert.alert("Invalid Date", "Use YYYY-MM-DD format");
      return;
    }

    const payload = {
      rsuName: rsuname,
      auditDate: new Date(),
      remarks,
      primaryRectifier: {
        type: pType,
        installedDate: pDate,
        moduleType: pModuleType,
        modules: {
          working: Number(pWorking),
          faulty: Number(pFaulty),
          total: pTotalModules,
        },
        capacity: Number(pCapacity),
        dcLoad: Number(pLoad),
        loadPercentage: Number(pLoadPct),
        phase: pPhase,
        healthStatus: healthStatus(pLoadPct),
        connectedNodes: pNodes,
      },
      secondaryRectifier: {
        type: sType,
        installedDate: sDate,
        moduleType: sModuleType,
        modules: {
          working: Number(sWorking),
          faulty: Number(sFaulty),
          total: sTotalModules,
        },
        capacity: Number(sCapacity),
        dcLoad: Number(sLoad),
        loadPercentage: Number(sLoadPct),
        phase: sPhase,
        healthStatus: healthStatus(sLoadPct),
        connectedNodes: sNodes,
      },
    };

    try {
      if (record?._id) {
        await updateRSU(record._id, payload);
        Alert.alert("Success", "RSU Updated Successfully");
      } else {
        await addRSU(payload);
        Alert.alert("Success", "RSU Added Successfully");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <LinearGradient
      colors={["#020617", "#0A1A44", "#051E54"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {record?._id ? "Update Rectifier" : "Add Rectifier"}
        </Text>

        {/* RSU NAME */}
        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Input placeholder="RSU Name" value={rsuname} onChangeText={setRsuName} />
        </ImageBackground>

        {/* PRIMARY RECTIFIER */}
        <Text style={styles.section}>Primary Rectifier Details</Text>
        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Input placeholder="Rectifier Type" value={pType} onChangeText={setPType} />
          <Input
            placeholder="Installed Date (YYYY-MM-DD)"
            value={pDate}
            onChangeText={setPDate}
          />
          <Input placeholder="Module Type" value={pModuleType} onChangeText={setPModuleType} />
          <Input
            placeholder="Working Modules"
            keyboardType="numeric"
            value={pWorking}
            onChangeText={setPWorking}
          />
          <Input
            placeholder="Faulty Modules"
            keyboardType="numeric"
            value={pFaulty}
            onChangeText={setPFaulty}
          />
          <Input
            placeholder="Module Capacity (A)"
            keyboardType="numeric"
            value={pCapacity}
            onChangeText={setPCapacity}
          />
          <Input
            placeholder="DC Load (A)"
            keyboardType="numeric"
            value={pLoad}
            onChangeText={setPLoad}
          />
          <Text style={styles.info}>Total Modules: {pTotalModules}</Text>
          <Text style={styles.info}>Load Utilization: {pLoadPct}%</Text>
          <Text style={[styles.status, styles[healthStatus(pLoadPct)]]}>
            Status: {healthStatus(pLoadPct)}
          </Text>
          <RadioGroup
            title="Phase"
            options={["Single", "Three Phase"]}
            selected={pPhase}
            onChange={setPPhase}
          />
          {pNodes.map((n, i) => (
            <Input
              key={i}
              placeholder={`Connected Node ${i + 1}`}
              value={n}
              onChangeText={(t) => {
                const copy = [...pNodes];
                copy[i] = t;
                setPNodes(copy);
              }}
            />
          ))}
        </ImageBackground>

        {/* SECONDARY RECTIFIER */}
        <Text style={styles.section}>Secondary Rectifier Details</Text>
        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Input placeholder="Rectifier Type" value={sType} onChangeText={setSType} />
          <Input
            placeholder="Installed Date (YYYY-MM-DD)"
            value={sDate}
            onChangeText={setSDate}
          />
          <Input placeholder="Module Type" value={sModuleType} onChangeText={setSModuleType} />
          <Input
            placeholder="Working Modules"
            keyboardType="numeric"
            value={sWorking}
            onChangeText={setSWorking}
          />
          <Input
            placeholder="Faulty Modules"
            keyboardType="numeric"
            value={sFaulty}
            onChangeText={setSFaulty}
          />
          <Input
            placeholder="Module Capacity (A)"
            keyboardType="numeric"
            value={sCapacity}
            onChangeText={setSCapacity}
          />
          <Input
            placeholder="DC Load (A)"
            keyboardType="numeric"
            value={sLoad}
            onChangeText={setSLoad}
          />
          <Text style={styles.info}>Total Modules: {sTotalModules}</Text>
          <Text style={styles.info}>Load Utilization: {sLoadPct}%</Text>
          <Text style={[styles.status, styles[healthStatus(sLoadPct)]]}>
            Status: {healthStatus(sLoadPct)}
          </Text>
          <RadioGroup
            title="Phase"
            options={["Single", "Three Phase"]}
            selected={sPhase}
            onChange={setSPhase}
          />
          {sNodes.map((n, i) => (
            <Input
              key={i}
              placeholder={`Connected Node ${i + 1}`}
              value={n}
              onChangeText={(t) => {
                const copy = [...sNodes];
                copy[i] = t;
                setSNodes(copy);
              }}
            />
          ))}
        </ImageBackground>

        {/* REMARKS */}
        <ImageBackground
          source={require("../../assets/images/slt3.jpg")}
          style={styles.card}
          imageStyle={styles.cardImage}
        >
          <Input
            placeholder="Engineer Remarks"
            value={remarks}
            onChangeText={setRemarks}
            multiline
          />
        </ImageBackground>

        <Button
          title={record?._id ? "Update" : "Submit"}
          onPress={handleSubmit}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 22, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: "800", color: "#EAF2FF", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "700", color: "#93C5FD", marginVertical: 12 },
  card: { borderRadius: 18, padding: 16, gap: 14, marginBottom: 12, overflow: "hidden" },
  cardImage: { borderRadius: 18, opacity: 0.35 },
  info: { color: "#CBD5F5", fontSize: 14 },
  status: { fontWeight: "700", fontSize: 15 },
  Healthy: { color: "#22C55E" },
  Warning: { color: "#FACC15" },
  Critical: { color: "#EF4444" },
});