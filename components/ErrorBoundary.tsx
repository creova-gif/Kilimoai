import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[KILIMO AI] Unhandled error caught by boundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={s.container}>
          <View style={s.inner}>
            <View style={s.iconWrap}>
              <AlertTriangle size={48} color="#ef4444" />
            </View>
            <Text style={s.title}>Hitilafu Imetokea</Text>
            <Text style={s.subtitle}>Something went wrong</Text>
            {__DEV__ && this.state.error ? (
              <Text style={s.errorMsg} numberOfLines={4}>
                {this.state.error.message}
              </Text>
            ) : null}
            <TouchableOpacity style={s.btn} onPress={this.handleReset} activeOpacity={0.8}>
              <Text style={s.btnText}>Jaribu Tena / Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  inner:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconWrap:  { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(239,68,68,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title:     { fontSize: 24, fontFamily: 'Inter_900Black', color: '#f8fafc', marginBottom: 8, textAlign: 'center' },
  subtitle:  { fontSize: 15, color: '#94a3b8', marginBottom: 16, textAlign: 'center', fontFamily: 'Inter_500Medium' },
  errorMsg:  { fontSize: 11, color: '#ef4444', fontFamily: 'Inter_500Medium', backgroundColor: 'rgba(239,68,68,0.08)', padding: 12, borderRadius: 10, marginBottom: 24, width: '100%' },
  btn:       { backgroundColor: '#22d15a', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  btnText:   { fontSize: 15, fontFamily: 'Inter_800ExtraBold', color: '#020617' },
});
