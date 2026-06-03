import 'package:flutter/material.dart';

import 'gate0_routes.dart';

void main() {
  runApp(const ThaiMeetApp());
}

class ThaiMeetApp extends StatelessWidget {
  const ThaiMeetApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Thai Meet',
      home: Scaffold(
        appBar: AppBar(title: const Text('Thai Meet')),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Gate 0 Trust Loop Shell'),
            const SizedBox(height: 12),
            for (final route in gate0Routes) Text('${route.name}: ${route.path}'),
          ],
        ),
      ),
    );
  }
}
