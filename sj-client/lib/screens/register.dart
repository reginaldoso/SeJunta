import 'package:flutter/material.dart';
import '../services/api.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameCtl = TextEditingController();
  final _emailCtl = TextEditingController();
  final _passCtl = TextEditingController();
  final _cpfCtl = TextEditingController();
  bool _loading = false;

  Future<void> _submit() async {
    setState(() => _loading = true);
    final res = await Api.register(_nameCtl.text.trim(), _emailCtl.text.trim(), _passCtl.text, _cpfCtl.text.trim());
    setState(() => _loading = false);
    if (res != null && res['id'] != null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Registro concluído')));
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res?['error'] ?? 'Erro')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SeJunta — Registro')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(children: [
          TextField(controller: _nameCtl, decoration: const InputDecoration(labelText: 'Nome')),
          TextField(controller: _emailCtl, decoration: const InputDecoration(labelText: 'E-mail')),
          TextField(controller: _passCtl, decoration: const InputDecoration(labelText: 'Senha'), obscureText: true),
          TextField(controller: _cpfCtl, decoration: const InputDecoration(labelText: 'CPF')),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: _loading ? null : _submit, child: _loading ? const CircularProgressIndicator() : const Text('Registrar')),
        ]),
      ),
    );
  }
}
