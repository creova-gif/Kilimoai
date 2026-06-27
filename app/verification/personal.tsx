import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PageScaffold from '../../components/PageScaffold';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function PersonalVerification() {
  const router = useRouter();
  const [nida, setNida] = useState('');
  const [dob, setDob] = useState('');

  const isValid = nida.length >= 8 && dob.length >= 4;

  return (
    <PageScaffold title="Personal Details" subtitle="Step 1 of 2">
      <View style={styles.content}>
        <Input
          label="NIDA Number or Passport"
          placeholder="e.g. 19901234..."
          value={nida}
          onChangeText={setNida}
          keyboardType="number-pad"
        />
        <Input
          label="Date of Birth (YYYY-MM-DD)"
          placeholder="1990-01-01"
          value={dob}
          onChangeText={setDob}
        />
        <Button
          label="Continue to Business Info"
          disabled={!isValid}
          onPress={() => router.push('/verification/business')}
          style={{ marginTop: 24 }}
        />
      </View>
    </PageScaffold>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
});
