import 'package:flutter/material.dart';
import '../services/api.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtl = TextEditingController();
  final _passCtl = TextEditingController();
  bool _loading = false;

  Future<void> _submit() async {
    setState(() => _loading = true);
    final res = await Api.login(_emailCtl.text.trim(), _passCtl.text);
    setState(() => _loading = false);
    if (res != null && res['token'] != null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Login OK')));
      // TODO: persist token and navigate to Home
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res?['error'] ?? 'Erro')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SeJunta — Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(children: [
          TextField(controller: _emailCtl, decoration: const InputDecoration(labelText: 'E-mail')),
          TextField(controller: _passCtl, decoration: const InputDecoration(labelText: 'Senha'), obscureText: true),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: _loading ? null : _submit, child: _loading ? const CircularProgressIndicator() : const Text('Entrar')),
          TextButton(onPressed: () => Navigator.pushNamed(context, '/register'), child: const Text('Criar conta'))
        ]),
      ),
    );
  }
}
