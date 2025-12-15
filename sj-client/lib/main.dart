import 'package:flutter/material.dart';
import 'screens/login.dart';
import 'screens/register.dart';

void main() {
  runApp(const SjApp());
}

class SjApp extends StatelessWidget {
  const SjApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SeJunta',
      theme: ThemeData(primarySwatch: Colors.blue, brightness: Brightness.light),
      initialRoute: '/login',
      routes: {
        '/login': (c) => const LoginScreen(),
        '/register': (c) => const RegisterScreen(),
      },
    );
  }
}
